import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch live data for context
    const [{ data: hotspots }, { data: alerts }] = await Promise.all([
      supabase.from("hotspots").select("village_name, risk_score, temp, humidity, rain_mm, water_stagnation_days, status").order("risk_score", { ascending: false }).limit(15),
      supabase.from("alerts").select("village, risk_score, status, created_at").order("created_at", { ascending: false }).limit(10),
    ]);

    const systemPrompt = `You are HeatWave AI Assistant — an expert on heatwave risk prediction and vector-borne disease prevention in Karnataka, India.

Current Live Data:
HOTSPOTS: ${JSON.stringify(hotspots || [])}
RECENT ALERTS: ${JSON.stringify(alerts || [])}

Risk Formula: risk_score = 0.41*temp_normalized + 0.39*rain_lag + 0.20*humidity*stagnation
- High Risk: ≥70%, Medium: 30-70%, Low: <30%

Respond concisely. Use data to back answers. If asked about specific villages, reference real data. Suggest preventive actions for high-risk areas. Keep responses under 150 words.`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
