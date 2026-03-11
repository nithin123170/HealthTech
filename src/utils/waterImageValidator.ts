/**
 * Water Image Validator — uses HuggingFace free Inference API (no key needed).
 *
 * Sends the image to HuggingFace's servers where CLIP classifies it.
 * - Zero-config: no API key or model download required
 * - Fast: usually responds in < 2 seconds
 * - Falls back to allowing the image if the API is unavailable
 */

// HuggingFace Inference API — anonymous free tier (rate-limited but sufficient)
const HF_API_URL =
  'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32';

export type ValidationResult = {
  isWater: boolean;
  reason: string;
};

/** Resize and encode image element to JPEG base64 */
function toBase64Jpeg(el: HTMLImageElement | HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  canvas.getContext('2d')!.drawImage(el, 0, 0, 224, 224);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/** Convert base64 data URL to a Blob so we can send raw binary */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

/**
 * Calls HuggingFace CLIP with two candidate labels (binary comparison):
 * - "a photo showing water" vs "a photo not showing water"
 *
 * If the model returns an error or is loading, we retry once after a short wait.
 * If the API is unreachable, we allow the upload (don't block the user).
 */
export async function validateWaterImage(
  imageElement: HTMLImageElement | HTMLVideoElement
): Promise<ValidationResult> {
  const dataUrl = toBase64Jpeg(imageElement);
  const imageBlob = dataUrlToBlob(dataUrl);

  const WATER_LABEL = 'water, river, lake, pond, flood, stagnant water, waterway, puddle, drain, stream';
  const OTHER_LABEL = 'people, animals, buildings, documents, food, roads, cars, furniture';

  const callApi = async (): Promise<Response> => {
    return fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: dataUrl.split(',')[1], // base64 only, no prefix
          candidate_labels: [WATER_LABEL, OTHER_LABEL],
        },
      }),
    });
  };

  let response = await callApi();

  // HF returns 503 when model is still loading — wait and retry multiple times
  if (response.status === 503) {
    console.log('HuggingFace model is loading, retrying...');
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      response = await callApi();
      if (response.ok) break;
    }
  }

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`HuggingFace API error ${response.status}: ${errText}`);
    return {
      isWater: true, // Allow upload by default when API fails
      reason: `API unavailable (${response.status}) - allowing upload`,
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Array<{ label: string; score: number }> = await response.json();
    console.log('HuggingFace CLIP results:', data);

    const waterResult = data.find((d) => d.label === WATER_LABEL);
    const waterScore = waterResult?.score ?? 0;

    // Accept if water label wins (score > 0.25 — much lower threshold to be more permissive)
    const isWater = waterScore >= 0.25;

    return {
      isWater,
      reason: isWater
        ? `Water detected (score: ${(waterScore * 100).toFixed(0)}%)`
        : `No water detected (water score: ${(waterScore * 100).toFixed(0)}%)`,
    };
  } catch (parseError) {
    console.warn('Failed to parse API response:', parseError);
    return {
      isWater: true, // Allow upload by default when parsing fails
      reason: 'Response parsing failed - allowing upload',
    };
  }
}

/** Nothing to preload for server-side API approach */
export function preloadWaterValidator() {
  // Optionally warm up the HF model by sending a tiny request
  // (not needed — model is usually warm)
}
