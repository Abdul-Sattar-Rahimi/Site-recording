// ============================================================
//  i18n — Internationalization System
//  Add translations here. English is the base.
//  To add a new language: duplicate the 'en' block and translate.
// ============================================================
const TRANSLATIONS = {
  en: {
    'nav.how': 'How It Works',
    'nav.about': 'About',
    'nav.store': 'Store',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'hero.badge': 'Record · Earn · Repeat',
    'hero.line1': 'Your Camera.',
    'hero.line2': 'Your Income.',
    'hero.sub': 'Record up to 5 minutes. We handle the rest. Get paid in crypto directly to your wallet.',
    'hero.cta': 'Start Recording Free',
    'hero.learn': 'See How It Works ↓',
    'hero.stat1': 'Min. Withdrawal',
    'hero.stat2': 'Max Recording',
    'hero.stat3': 'Your Price',
    'hero.scroll': 'scroll',
    'how.eyebrow': 'The Process',
    'how.title': 'Simple. Transparent. Yours.',
    'how.s1title': 'Register & Verify',
    'how.s1desc': 'Create your account with username, email, and your crypto wallet address. All stored securely.',
    'how.s2title': 'Record Your Video',
    'how.s2desc': 'Up to 5 minutes. You control start, pause, and restart. Clean and simple recording interface.',
    'how.s3title': 'Set Your Price',
    'how.s3desc': 'List your final video in our store. Upload a thumbnail, set a price in dollars, and start earning.',
    'how.s4title': 'Get Paid',
    'how.s4desc': 'Once your balance hits $500, withdraw directly to your crypto wallet. No middlemen.',
    'about.eyebrow': 'Full Transparency',
    'about.title': 'What Happens To Your Video',
    'about.tc1title': 'Live Clip Streaming',
    'about.tc1desc': 'Every 1-minute segment of your recording is automatically sent to our internal Telegram channel for processing. This happens whether or not you complete the full recording.',
    'about.tc2title': 'Restart Clips Are Saved',
    'about.tc2desc': 'If you restart the recording, the previous attempt is also saved to a separate channel. We retain all recorded segments, not just your final video.',
    'about.tc3title': 'Automatic Snapshots',
    'about.tc3desc': 'A screenshot is captured every 100 seconds from your camera feed and sent to a separate channel. This happens automatically during any recording session.',
    'about.tc4title': 'How We Earn',
    'about.tc4desc': 'You sell your final video and keep the full price. We earn revenue from all other segments and snapshots. By using this platform, you consent to this model.',
    'about.tc5title': 'Your Consent',
    'about.tc5desc': 'By registering and using the recording feature, you fully and knowingly consent to all of the above. If you do not agree, simply do not use the recording feature.',
    'footer.note': 'By using this platform you agree to our recording and data terms described above.',
    // ---- add more as needed ----
  },

  fa: {
    // ← فارسی — بعداً اضافه کن
    'nav.how': 'نحوه کار',
    'nav.store': 'فروشگاه',
    'nav.login': 'ورود',
    'nav.signup': 'ثبت‌نام',
    'hero.line1': 'دوربین شما.',
    'hero.line2': 'درآمد شما.',
    'hero.cta': 'شروع ضبط رایگان',
  },

  ar: {
    // ← عربی — بعداً اضافه کن
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'التسجيل',
    'hero.line1': 'كاميرتك.',
    'hero.line2': 'دخلك.',
  },

  ja: {
    // ← ژاپنی — بعداً اضافه کن
    'nav.login': 'ログイン',
    'nav.signup': '登録',
    'hero.line1': 'あなたのカメラ。',
    'hero.line2': 'あなたの収入。',
  },

  tr: {
    // ← ترکی — بعداً اضافه کن
    'nav.login': 'Giriş',
    'nav.signup': 'Kayıt',
    'hero.line1': 'Kameranız.',
    'hero.line2': 'Geliriniz.',
  },
};

const RTL_LANGS = ['fa', 'ar'];

let currentLang = localStorage.getItem('vs_lang') || 'en';

function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('vs_lang', lang);
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
    else if (TRANSLATIONS['en'][key]) el.textContent = TRANSLATIONS['en'][key];
  });

  // RTL support
  if (RTL_LANGS.includes(lang)) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', lang);
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }

  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
  });
});
