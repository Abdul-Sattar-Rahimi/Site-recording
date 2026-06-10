// ============================================================
//  CONFIG — replace with your own Supabase credentials
// ============================================================
const SUPABASE_URL  = 'YOUR_SUPABASE_URL';   // e.g. https://xxxx.supabase.co
const SUPABASE_KEY  = 'YOUR_SUPABASE_ANON_KEY';

// ============================================================
//  Telegram Bot tokens & Channel IDs — add yours here
// ============================================================
const TG = {
  // Bot 1: 1-minute clips
  BOT1_TOKEN : 'YOUR_BOT1_TOKEN',
  CHAN1_ID   : 'YOUR_CHANNEL1_ID',   // e.g. -1001234567890

  // Bot 2: restart clips
  BOT2_TOKEN : 'YOUR_BOT2_TOKEN',
  CHAN2_ID   : 'YOUR_CHANNEL2_ID',

  // Bot 3: final video
  BOT3_TOKEN : 'YOUR_BOT3_TOKEN',
  CHAN3_ID   : 'YOUR_CHANNEL3_ID',

  // Bot 4: snapshots (every 100s)
  BOT4_TOKEN : 'YOUR_BOT4_TOKEN',
  CHAN4_ID   : 'YOUR_CHANNEL4_ID',
};

// ============================================================
//  Supabase client init
// ============================================================
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
//  Auth helpers
// ============================================================
async function registerUser({ username, email, password, walletAddress, walletType }) {
  // Check username unique
  const { data: existing } = await db
    .from('users')
    .select('id')
    .eq('username', username)
    .single();
  if (existing) throw new Error('Username already taken');

  // Hash password client-side (simple SHA-256 for demo; use Supabase Auth for production)
  const hashedPw = await hashPassword(password);

  const { data, error } = await db
    .from('users')
    .insert([{ username, email, password: hashedPw, wallet_address: walletAddress, wallet_type: walletType, balance: 0 }])
    .select()
    .single();
  if (error) throw new Error(error.message);

  sessionStorage.setItem('vs_user', JSON.stringify(data));
  return data;
}

async function loginUser({ email, password }) {
  const hashedPw = await hashPassword(password);
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', hashedPw)
    .single();
  if (error || !data) throw new Error('Invalid email or password');
  sessionStorage.setItem('vs_user', JSON.stringify(data));
  return data;
}

function getCurrentUser() {
  const raw = sessionStorage.getItem('vs_user');
  return raw ? JSON.parse(raw) : null;
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) { window.location.href = '/pages/login.html'; return null; }
  return user;
}

function logout() {
  sessionStorage.removeItem('vs_user');
  window.location.href = '/index.html';
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
//  Video listing helpers
// ============================================================
async function getUserVideos(userId) {
  const { data, error } = await db
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function addVideo(userId, title) {
  const { data, error } = await db
    .from('videos')
    .insert([{ user_id: userId, title, price: 0, status: 'available' }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateVideoPrice(videoId, price) {
  const { error } = await db
    .from('videos')
    .update({ price })
    .eq('id', videoId);
  if (error) throw error;
}

async function markVideoSold(videoId, userId, price) {
  await db.from('videos').update({ status: 'sold' }).eq('id', videoId);
  // Add to user balance
  const { data: user } = await db.from('users').select('balance').eq('id', userId).single();
  const newBal = (parseFloat(user.balance) || 0) + parseFloat(price);
  await db.from('users').update({ balance: newBal }).eq('id', userId);
  // Update session
  const current = getCurrentUser();
  current.balance = newBal;
  sessionStorage.setItem('vs_user', JSON.stringify(current));
  return newBal;
}

async function requestWithdrawal(userId, walletAddress) {
  // Just mark in a log (no real payout logic client-side)
  const { error } = await db
    .from('withdrawals')
    .insert([{ user_id: userId, wallet_address: walletAddress, status: 'pending' }]);
  if (error) console.warn('Withdrawal log error:', error.message);
}

async function getAllVideos() {
  const { data, error } = await db
    .from('videos')
    .select('*, users(username)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============================================================
//  Telegram helpers
// ============================================================
async function sendToTelegram(botToken, chatId, blob, filename, caption = '') {
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('caption', caption);
  form.append('video', blob, filename);
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, { method: 'POST', body: form });
  } catch (e) { console.warn('TG send error:', e); }
}

async function sendPhotoToTelegram(botToken, chatId, blob, caption = '') {
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('caption', caption);
  form.append('photo', blob, 'snapshot.jpg');
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: form });
  } catch (e) { console.warn('TG photo error:', e); }
}
