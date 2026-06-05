/* ════════════════════════════════════════════════════════
   GET BIZ ONLINE USA — app.js
   getbizonlineusa.com
   Instagram: @GetBizOnline
════════════════════════════════════════════════════════ */

const CONFIG = {
  STRIPE_PUBLISHABLE_KEY: 'pk_test_REPLACE_WITH_YOUR_STRIPE_KEY',
  AI_API_ENDPOINT:        'https://YOUR_BACKEND/api/chat',
  WHATSAPP_NUMBER:        '',   // Add your number later e.g. '14045551234'
  CONTACT_FORM_ENDPOINT:  'https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID',
  INSTAGRAM:              'https://instagram.com/GetBizOnline',
};

const PACKAGES = {
  starter:  { name: 'Starter Package',  price: 299, priceId: 'price_STARTER_ID' },
  business: { name: 'Business Package', price: 499, priceId: 'price_BUSINESS_ID' },
  premium:  { name: 'Premium Package',  price: 999, priceId: 'price_PREMIUM_ID' },
};

/* ════ NAV ════ */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ════ COUNTERS ════ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num[data-target]').forEach(el => counterObserver.observe(el));

/* ════ SCROLL REVEAL ════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

['.service-card', '.pricing-card', '.portfolio-card', '.testi', '.section-head'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    revealObserver.observe(el);
  });
});

/* ════ CHATBOT ════ */
const chatbot      = document.getElementById('chatbot');
const chatToggle   = document.getElementById('chatToggle');
const chatClose    = document.getElementById('chatClose');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const quickReplies = document.getElementById('quickReplies');

const LOCAL_RESPONSES = {
  price:    "Our packages:\n\n💼 Starter — $299: Single-page site + WhatsApp button\n⭐ Business — $499: Full site + promo video + payments + WhatsApp (most popular!)\n👑 Premium — $999: Everything + e-commerce + 3 videos + 3 months maintenance",
  timeline: "Most websites are delivered in 48–72 hours! The promo video is ready within 5–7 business days. We work fast. ⚡",
  whatsapp: "Yes! Every package includes WhatsApp integration so customers can message you with one tap directly from your site. 💬",
  payment:  "We integrate Stripe and PayPal so you can accept payments right on your website. 💳",
  video:    "The Business and Premium packages include a 30–60 second professional promo video for your business — ready for Instagram and Facebook! 🎬",
  contact:  "You can reach us via this contact form, or DM us on Instagram @GetBizOnline. We reply within 24 hours! 📸",
  default:  "Great question! I'd love to help. Fill out our contact form on this page or DM us on Instagram @GetBizOnline and we'll get back to you within 24 hours. 🚀"
};

function matchLocal(text) {
  const t = text.toLowerCase();
  if (t.match(/price|cost|how much|package|offer/)) return LOCAL_RESPONSES.price;
  if (t.match(/time|long|fast|quick|hours|days/))   return LOCAL_RESPONSES.timeline;
  if (t.match(/whatsapp|chat|message/))             return LOCAL_RESPONSES.whatsapp;
  if (t.match(/pay|stripe|paypal|payment/))         return LOCAL_RESPONSES.payment;
  if (t.match(/video|promo|film/))                  return LOCAL_RESPONSES.video;
  if (t.match(/contact|email|reach|talk|instagram/))return LOCAL_RESPONSES.contact;
  return LOCAL_RESPONSES.default;
}

function appendMessage(role, text) {
  const wrap   = document.createElement('div');
  wrap.className = `chat-msg chat-msg--${role === 'user' ? 'user' : 'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg chat-msg--bot chat-typing';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = '<div class="chat-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function sendMessage(text) {
  const message = (text || chatInput.value).trim();
  if (!message) return;
  if (quickReplies) quickReplies.style.display = 'none';
  appendMessage('user', message);
  chatInput.value = '';
  showTyping();
  await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
  removeTyping();
  appendMessage('bot', matchLocal(message));
}

function sendQuick(text) { sendMessage(text); }

chatToggle.addEventListener('click', () => chatbot.classList.toggle('open'));
chatClose.addEventListener('click',  () => chatbot.classList.remove('open'));
chatSend.addEventListener('click',   () => sendMessage());
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

/* ════ STRIPE ════ */
let stripe, cardElement, selectedPackage;

function initStripe() {
  if (!window.Stripe || CONFIG.STRIPE_PUBLISHABLE_KEY.includes('REPLACE')) return;
  stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
  const elements = stripe.elements();
  cardElement = elements.create('card', {
    style: {
      base: { color: '#ffffff', fontFamily: 'Barlow, sans-serif', fontSize: '15px', '::placeholder': { color: 'rgba(255,255,255,0.4)' } },
      invalid: { color: '#ff6b6b' }
    }
  });
  cardElement.mount('#stripe-card-element');
  cardElement.on('change', ({ error }) => {
    document.getElementById('card-errors').textContent = error ? error.message : '';
  });
}

function handleCheckout(packageKey) {
  selectedPackage = packageKey;
  const pkg = PACKAGES[packageKey];
  document.getElementById('modalPackage').textContent = `${pkg.name} — $${pkg.price}`;
  document.getElementById('paymentModal').classList.add('open');
  if (!cardElement) initStripe();
}

async function submitPayment() {
  const btn   = document.getElementById('payBtn');
  const errEl = document.getElementById('card-errors');
  if (!stripe || !cardElement) {
    errEl.textContent = 'Payment not configured yet. Please contact us on Instagram @GetBizOnline.';
    return;
  }
  btn.textContent = 'Processing...';
  btn.disabled = true;
  const { error } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
  if (error) {
    errEl.textContent = error.message;
    btn.textContent = 'Pay Now →';
    btn.disabled = false;
    return;
  }
  setTimeout(() => {
    document.getElementById('paymentModal').classList.remove('open');
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:90px;left:50%;transform:translateX(-50%);background:#25D366;color:#fff;padding:16px 28px;border-radius:10px;font-weight:700;font-size:16px;z-index:99999;box-shadow:0 8px 28px rgba(0,0,0,0.4);';
    banner.textContent = `✅ Order received for ${PACKAGES[selectedPackage].name}! We'll contact you within 24 hours.`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 6000);
    btn.textContent = 'Pay Now →';
    btn.disabled = false;
  }, 1200);
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('paymentModal').classList.remove('open');
});
document.getElementById('paymentModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
});

/* ════ CONTACT FORM ════ */
async function handleContactForm(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  const data    = Object.fromEntries(new FormData(form));

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    if (!CONFIG.CONTACT_FORM_ENDPOINT.includes('REPLACE')) {
      await fetch(CONFIG.CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  } catch (_) {}

  await new Promise(r => setTimeout(r, 900));
  form.reset();
  success.style.display = 'block';
  btn.textContent = 'Send Message →';
  btn.disabled = false;
  setTimeout(() => { success.style.display = 'none'; }, 6000);
}

/* ════ ACTIVE NAV ════ */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav__links a').forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ════ INIT ════ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Get Biz Online USA — getbizonlineusa.com');
  console.log('📸 Instagram: @GetBizOnline');
  if (window.Stripe) initStripe();
});
