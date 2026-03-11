import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'mr' | 'gu' | 'bn' | 'pa' | 'ml' | 'or' | 'as' | 'ur';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    kn: 'ಮುಖಪುಟ',
    hi: 'होम',
    ta: 'முகப்பு',
    te: 'హోమ్',
    mr: 'मुखपृष्ठ',
    gu: 'હોમ',
    bn: 'হোম',
    pa: 'ਹੋਮ',
    ml: 'ഹോം',
    or: 'ହୋମ୍',
    as: 'হোম',
    ur: 'گھر'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    hi: 'डैशबोर्ड',
    ta: 'டாஷ்போர்டு',
    te: 'డాష్‌బోర్డ్',
    mr: 'डॅशबोर्ड',
    gu: 'ડેશબોર્ડ',
    bn: 'ড্যাশবোর্ড',
    pa: 'ਡੈਸ਼ਬੋਰਡ',
    ml: 'ഡാഷ്ബോർഡ്',
    or: 'ଡ୍ୟାସବୋର୍ଡ୍',
    as: 'ড্যাছবোৰ্ড',
    ur: 'ڈیش بورڈ'
  },
  'nav.report': {
    en: 'Report Hotspot',
    kn: 'ಹಾಟ್‌ಸ್ಪಾಟ್ ವರದಿ ಮಾಡಿ',
    hi: 'हॉटस्पॉट रिपोर्ट करें',
    ta: 'ஹாட்ஸ்பாட் அறிக்கை',
    te: 'హాట్‌స్పాట్‌ని నివేదించండి',
    mr: 'हॉटस्पॉट रिपोर्ट करा',
    gu: 'હોટસ્પોટ અહેવલ આપો',
    bn: 'হটস্পট রিপোর্ট করুন',
    pa: 'ਹੋਟਸਪਾਟ ਰਿਪੋਰਟ ਕਰੋ',
    ml: 'ഹോട്സ്പോട്ട് റിപ്പോർട്ട് ചെയ്യുക',
    or: 'ହଟସ୍ପଟ୍ ରିପୋର୍ଟ୍ କରନ୍ତୁ',
    as: 'হটস্পট ৰিপোৰ্ট কৰক',
    ur: 'ہاٹ سپاٹ رپورٹ کریں'
  },
  'nav.timeline': {
    en: 'Risk Timeline',
    kn: 'ಅಪಾಯ ಟೈಮ್‌ಲೈನ್',
    hi: 'रिस्क टाइमलाइन',
    ta: 'ஆபத்து காலக்கெடு',
    te: 'రిస్క్ టైమ్‌లైన్',
    mr: 'रिस्क टाइमलाइन',
    gu: 'રિસ્ક ટાઇમલાઇન',
    bn: 'ঝুঁকি টাইমলাইন',
    pa: 'ਰਿਸਕ ਟਾਈਮਲਾਈਨ',
    ml: 'റിസ്ക് ടൈംലൈൻ',
    or: 'ରିସ୍କ ଟାଇମଲାଇନ୍',
    as: 'বিপদ টাইমলাইন',
    ur: 'رسک ٹائم لائن'
  },
  'nav.about': {
    en: 'About',
    kn: 'ಬಗ್ಗೆ',
    hi: 'के बारे में',
    ta: 'பற்றி',
    te: 'గురించి',
    mr: 'बद्दल',
    gu: 'વિશે',
    bn: 'সম্পর্কে',
    pa: 'ਬਾਰੇ',
    ml: 'സംബന്ധിച്ച്',
    or: 'ବାବେ',
    as: 'বিষযে',
    ur: 'کے بارے میں'
  },

  // Report Page
  'report.title': {
    en: 'Report Hotspot',
    kn: 'ಹಾಟ್‌ಸ್ಪಾಟ್ ವರದಿ ಮಾಡಿ',
    hi: 'हॉटस्पॉट रिपोर्ट करें',
    ta: 'ஹாட்ஸ்பாட் அறிக்கை',
    te: 'హాట్‌స్పాట్‌ని నివేదించండి',
    mr: 'हॉटस्पॉट रिपोर्ट करा',
    gu: 'હોટસ્પોટ અહેવલ આપો',
    bn: 'হটস্পট রিপোর্ট করুন',
    pa: 'ਹੋਟਸਪਾਟ ਰਿਪੋਰਟ ਕਰੋ',
    ml: 'ഹോട്സ്പോട്ട് റിപ്പോർട്ട് ചെയ്യുക',
    or: 'ହଟସ୍ପଟ୍ ରିପୋର୍ଟ୍ କରନ୍ତୁ',
    as: 'হটস্পট ৰিপোৰ্ট কৰক',
    ur: 'ہاٹ سپاٹ رپورٹ کریں'
  },
  'report.subtitle': {
    en: 'Submit environmental data for AI risk prediction',
    kn: 'AI ಅಪಾಯ ಮುನ್ಸೂಚನೆಗಾಗಿ ಪರಿಸರ ದತ್ತಾಂಶವನ್ನು ಸಲ್ಲಿಸಿ',
    hi: 'AI जोखिम भविष्यवाणी के लिए पर्यावरण डेटा सबमिट करें',
    ta: 'AI ஆபத்து கணிப்பிற்கு சுற்றுச்சூழல் தரவை சமர்ப்பிக்கவும்',
    te: 'AI రిస్క్ అంచనా కోసం పర్యావరణ డేటాను సమర్పించండి',
    mr: 'AI जोखीम भविष्यवाणीसाठी पर्यावरण डेटा सादर करा',
    gu: 'AI જોખમ ભવિષ્યવાણી માટે પર્યાવરણ ડેટા સબમિટ કરો',
    bn: 'AI ঝুঁকি পূর্বাভাসের জন্য পরিবেশ ডেটা জমা দিন',
    pa: 'AI ਜੋਖਮ ਭਵਿਸ਼ਵਾਣੀ ਲਈ ਵਾਤਾਵਰਣ ਡਾਟਾ ਜਮ੍ਹਾਂ ਕਰੋ',
    ml: 'AI റിസ്‌ക് പ്രവചനത്തിന് പാരിസ്ഥിതിക ഡാറ്റ സമർപ്പിക്കുക',
    or: 'AI ିପଦାଣୀ ବାବେ ାବିସ୍ଥି ବିବାବା ବାବିବା',
    as: 'AI বিপদ পূৰ্বাভাসৰ বাবে পৰিৱেশ াটা দিয়ক',
    ur: 'AI جوکھم کی پیشگوئی کے لیے ماحولی ڈیٹا جمع کریں'
  },
  'report.location': {
    en: 'Location',
    kn: 'ಸ್ಥಳ',
    hi: 'स्थान',
    ta: 'இடம்',
    te: 'స్థానం',
    mr: 'स्थान',
    gu: 'સ્થાન',
    bn: 'অবস্থান',
    pa: 'ਥਾਂ',
    ml: 'സ്ഥാനം',
    or: 'ସ୍ଥାନ',
    as: 'স্থান',
    ur: 'مقام'
  },
  'report.village': {
    en: 'Village Name',
    kn: 'ಗ್ರಾಮದ ಹೆಸರು',
    hi: 'गांव का नाम',
    ta: 'கிராமத்தின் பெயர்',
    te: 'గ్రామం పేరు',
    mr: 'गावाचे नाव',
    gu: 'ગામનું નામ',
    bn: 'গ্রামের নাম',
    pa: 'ਪਿੰਡ ਦਾ ਨਾਮ',
    ml: 'ഗ്രാമത്തിന്റെ പേര്',
    or: 'ଗାଁରର ନାମ',
    as: 'গাঁৱৰ নাম',
    ur: 'گاؤں کا نام'
  },
  'report.photo': {
    en: 'Photo Evidence',
    kn: 'ಫೋಟೋ ಸಾಕ್ಷ್ಯ',
    hi: 'फोटो सबूत',
    ta: 'புகைப்பட ஆதாரம்',
    te: 'ఫోటో ఆధారం',
    mr: 'फोटो पुरावा',
    gu: 'ફોટો પુરાવો',
    bn: 'ফটো প্রমাণ',
    pa: 'ਫੋਟੋ ਸਬੂਤ',
    ml: 'ഫോട്ടോ തെളിവ്',
    or: 'ଫୋଟୋ ପ୍ରମାଣ',
    as: 'ফটো প্ৰমাণ',
    ur: 'فوٹو ثبوت'
  },
  'report.temp': {
    en: 'Temp (°C)',
    kn: 'ಉಷ್ಣತೆ (°C)',
    hi: 'तापमान (°C)',
    ta: 'வெப்பநிலை (°C)',
    te: 'ఉష్ణోగ్రత (°C)',
    mr: 'तापमान (°C)',
    gu: 'તાપમાન (°C)',
    bn: 'তাপমাত্রা (°C)',
    pa: 'ਤਾਪਮਾਨ (°C)',
    ml: 'താപനില (°C)',
    or: 'ତାପମାନ (°C)',
    as: 'তাপমাত্ৰা (°C)',
    ur: 'درجہ حرارت (°C)'
  },
  'report.humidity': {
    en: 'Humidity (%)',
    kn: 'ಆರ್ದ್ರತೆ (%)',
    hi: 'नमी (%)',
    ta: 'ஈரப்பதம் (%)',
    te: 'తేమ (%)',
    mr: 'आर्द्रता (%)',
    gu: 'ભેજાશી (%)',
    bn: 'আর্দ্রতা (%)',
    pa: 'ਨਮੀ (%)',
    ml: 'ആർദ്രത (%)',
    or: 'ଆର୍ଦ୍ରତା (%)',
    as: 'আৰ্দ্ৰতা (%)',
    ur: 'نمی (%)'
  },
  'report.rain': {
    en: 'Rain 24h (mm)',
    kn: 'ಮಳೆ 24ಗಂ (mm)',
    hi: 'बारिश 24घं (mm)',
    ta: 'மழை 24மணி (mm)',
    te: 'వర్షం 24గం (mm)'
  },
  'report.stagnation': {
    en: 'Stagnation (days)',
    kn: 'ಸ್ಥಿರತೆ (ದಿನಗಳು)',
    hi: 'ठहराव (दिन)',
    ta: 'நிலைத்திருத்தல் (நாட்கள்)',
    te: 'స్థిరపడటం (రోజులు)'
  },
  'report.submit': {
    en: 'Submit & Predict',
    kn: 'ಸಲ್ಲಿಸಿ ಮತ್ತು ಮುನ್ಸೂಚಿಸಿ',
    hi: 'सबमिट करें और भविष्यवाणी करें',
    ta: 'சமர்ப்பித்து கணிக்கவும்',
    te: 'సమర్పించి అంచనా వ్యాఖ్యానించండి'
  },

  // Messages
  'msg.water_detected': {
    en: 'Valid water image detected!',
    kn: 'ಮಾನ್ಯವಾದ ನೀರಿನ ಚಿತ್ರ ಪತ್ತೆಯಾಗಿದೆ!',
    hi: 'वैध पानी की छवि का पता चला!',
    ta: 'சரியான நீர் படம் கண்டறியப்பட்டது!',
    te: 'చెల్లుబాటు అయిన నీటి చిత్రం గుర్తించబడింది!'
  },
  'msg.wrong_image': {
    en: 'Wrong image! Only water-related photos accepted — river, lake, flood, stagnant water, pond, etc.',
    kn: 'ತಪ್ಪು ಚಿತ್ರ! ಕೇವಲ ನೀರು-ಸಂಬಂಧಿತ ಫೋಟೋಗಳು ಮಾತ್ರ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ — ನದಿ, ಸರೋವರ, ಪ್ರವಾಹ, ಸ್ಥಿರ ನೀರು, ಕೊಳ, ಮುಂತಾದವುಗಳು.',
    hi: 'गलत छवि! केवल पानी से संबंधित फोटो स्वीकार किए जाते हैं — नदी, झील, बाढ़, ठहरा हुआ पानी, तालाब आदि।',
    ta: 'தவறான படம்! நீர் தொடர்பான புகைப்படங்கள் மட்டுமே ஏற்றுக்கொள்ளப்படும் — ஆறு, ஏரி, வெள்ளம், நிலையான நீர், குளம் போன்றவை.',
    te: 'తప్పు చిత్రం! నీరు-సంబంధిత ఫోటోలు మాత్రమే ఆమోదించబడతాయి — నది, సరస్సు, వరద, స్థిరమైన నీరు, చెరువు, మొదలైనవి.'
  },
  'msg.api_busy': {
    en: 'AI service busy. Image accepted automatically.',
    kn: 'AI ಸೇವೆ ಕಾಯುತ್ತಿದೆ. ಚಿತ್ರವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.',
    hi: 'AI सेवा व्यस्त है। छवि स्वचालित रूप से स्वीकार की गई।',
    ta: 'AI சேவை பிஸியில் உள்ளது. படம் தானாக ஏற்றுக்கொள்ளப்பட்டது.',
    te: 'AI సేవ బిజీగా ఉంది. చిత్రం స్వయంచాలకంగా ఆమోదించబడింది.'
  },

  // Language names
  'lang.en': { en: 'English', kn: 'ಇಂಗ್ಲಿಷ್', hi: 'अंग्रेजी', ta: 'ஆங்கிலம்', te: 'ఇంగ్లీష్', mr: 'इंग्रजी', gu: 'અંગ્રેજી', bn: 'ইংরাজি', pa: 'ਅੰਗਰੇਜ਼ੀ', ml: 'ഇംഗ്ലീഷ്', or: 'ଇଂଗାଲ୍ି', as: 'ইংৰাজী', ur: 'انگریزی' },
  'lang.kn': { en: 'Kannada', kn: 'ಕನ್ನಡ', hi: 'कन्नड़', ta: 'கன்னடம்', te: 'కన్నడ', mr: 'कन्नड', gu: 'કન્નડ', bn: 'কন্নড়', pa: 'ਕੰਨਾੜ', ml: 'കന്നഡ', or: 'କନାଡି', as: 'কন্নড়', ur: 'کنڑا' },
  'lang.hi': { en: 'Hindi', kn: 'ಹಿಂದಿ', hi: 'हिंदी', ta: 'இந்தி', te: 'హిందీ', mr: 'हिंदी', gu: 'હિંદી', bn: 'হিন্দি', pa: 'ਹਿੰਦੀ', ml: 'ഹിന്ദി', or: 'ବିନି', as: 'হিন্দী', ur: 'ہندی' },
  'lang.ta': { en: 'Tamil', kn: 'ತಮಿಳು', hi: 'तमिल', ta: 'தமிழ்', te: 'తమిళం', mr: 'तमिळ', gu: 'તમિળ', bn: 'তামিল', pa: 'ਤਾਮਿਲ', ml: 'തമിഴ്', or: 'ବାମିଲ', as: 'তামিল', ur: 'تامل' },
  'lang.te': { en: 'Telugu', kn: 'తెలుగు', hi: 'तेलुगू', ta: 'తెలుగు', te: 'తెలుగు', mr: 'तेलुगू', gu: 'તેલુગુ', bn: 'তেলেগু', pa: 'ਤੇਲਗੂ', ml: 'തെലുഗു', or: 'ବତାଲଗ', as: 'তেলেগু', ur: 'تیلگو' },
  'lang.mr': { en: 'Marathi', kn: 'ಮರಾಠಿ', hi: 'मराठी', ta: 'மராத்தி', te: 'మరాఠీ', mr: 'मराठी', gu: 'મરાઠી', bn: 'মারাঠি', pa: 'ਮਾਰਾਠੀ', ml: 'മറാത്തി', or: 'ବାରଠି', as: 'মাৰাঠী', ur: 'مراٹڑی' },
  'lang.gu': { en: 'Gujarati', kn: 'ಗುಜರಾತಿ', hi: 'गुजराती', ta: 'குஜராத்தி', te: 'గుజరాతీ', mr: 'गुजराती', gu: 'ગુજરાતી', bn: 'গুজরাতি', pa: 'ਗੁਜਰਾਤੀ', ml: 'ഗുജറാതി', or: 'ବଗଜରାଟି', as: 'গুজৰাতী', ur: 'گجراتی' },
  'lang.bn': { en: 'Bengali', kn: 'ಬೆಂಗಾಲಿ', hi: 'बांग्ला', ta: 'வங்காளம்', te: 'బెంగాలీ', mr: 'बांगला', gu: 'બાંગલા', bn: 'বাংলা', pa: 'ਬੰਾਂਗਲਾ', ml: 'ബംഗാളി', or: 'ବାଂଗାଲା', as: 'বাংলা', ur: 'بنگالی' },
  'lang.pa': { en: 'Punjabi', kn: 'ಪಂಜಾಬಿ', hi: 'पंजाबी', ta: 'பஞ்சாபி', te: 'పంజాబీ', mr: 'पंजाबी', gu: 'પંજાબી', bn: 'পাঞ্জাবি', pa: 'ਪੰਜਾਬੀ', ml: 'പഞ്ചാബി', or: 'ବପଞଜାବି', as: 'পাঞ্জাবী', ur: 'پنجابی' },
  'lang.ml': { en: 'Malayalam', kn: 'മലയാളം', hi: 'मलयालम', ta: 'மலையாலம்', te: 'మలయాళం', mr: 'मलयाळम', gu: 'મલયાલમ', bn: 'মালয়ালম', pa: 'ਮਾਲਿਆਲਮ', ml: 'മലയാളം', or: 'ବମଲଯାଲମ', as: 'মালয়ালম', ur: 'ملایالم' },
  'lang.or': { en: 'Odia', kn: 'ಒಡಿಯಾ', hi: 'उड़िया', ta: 'ஒடியா', te: 'ఒడియా', mr: 'उड़िया', gu: 'ઓડિયા', bn: 'ওড়িয়া', pa: 'ਓੜੀਆ', ml: 'ഒഡിയ', or: 'ଓଡିଆ', as: 'ওড়িয়া', ur: 'اڑیا' },
  'lang.as': { en: 'Assamese', kn: 'ಅಸ್ಸಾಮೀಸ್', hi: 'असमिया', ta: 'அஸ்ஸாமீஸ்', te: 'అస్సామీస్', mr: 'असमिया', gu: 'આસામી', bn: 'অসমীয়া', pa: 'ਅਸਾਮੀ', ml: 'അസ്സാമീസ്', or: 'ବଆସାମି', as: 'অসমীয়া', ur: 'آسامی' },
  'lang.ur': { en: 'Urdu', kn: 'ಉರ್ದು', hi: 'उर्दू', ta: 'உர்து', te: 'ఉర్దూ', mr: 'उर्दू', gu: 'ઉર્દૂ', bn: 'উর্দু', pa: 'ਉਰਦੂ', ml: 'ഉര്‌ദു', or: 'ଉରଦି', as: 'উৰ্দু', ur: 'اردو' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('heatwave-language');
    return (saved as Language) || 'kn'; // Default to Kannada for Karnataka
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const availableLanguages = [
    { code: 'en' as Language, name: t('lang.en') },
    { code: 'kn' as Language, name: t('lang.kn') },
    { code: 'hi' as Language, name: t('lang.hi') },
    { code: 'ta' as Language, name: t('lang.ta') },
    { code: 'te' as Language, name: t('lang.te') },
    { code: 'mr' as Language, name: t('lang.mr') },
    { code: 'gu' as Language, name: t('lang.gu') },
    { code: 'bn' as Language, name: t('lang.bn') },
    { code: 'pa' as Language, name: t('lang.pa') },
    { code: 'ml' as Language, name: t('lang.ml') },
    { code: 'or' as Language, name: t('lang.or') },
    { code: 'as' as Language, name: t('lang.as') },
    { code: 'ur' as Language, name: t('lang.ur') },
  ];

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('heatwave-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
