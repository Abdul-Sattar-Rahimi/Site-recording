# VidSell — Setup Guide

## Project Structure
```
videosell/
├── index.html          ← Landing page
├── css/style.css       ← All styles
├── js/
│   ├── db.js           ← Supabase + Telegram config (EDIT THIS)
│   ├── i18n.js         ← Translation system
│   ├── hero3d.js       ← Three.js 3D animation
│   └── main.js         ← Nav + animations
└── pages/
    ├── register.html
    ├── login.html
    ├── dashboard.html  ← Record / My Videos / Wallet
    └── store.html
```

---

## Step 1 — Supabase Setup

1. Go to https://supabase.com → New Project
2. After creation: Settings → API → copy **Project URL** and **anon key**
3. Go to SQL Editor and run:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  wallet_address TEXT,
  wallet_type TEXT DEFAULT 'USDT_TRC20',
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  wallet_address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Open `js/db.js` and replace:
   - `YOUR_SUPABASE_URL` → your Project URL
   - `YOUR_SUPABASE_ANON_KEY` → your anon key

---

## Step 2 — Telegram Bots Setup

For each bot:
1. Open Telegram → message @BotFather
2. Send `/newbot` → follow instructions → copy the token

Create 4 private channels and add each bot as admin.
To get channel ID: forward a message from the channel to @userinfobot

In `js/db.js`, replace:
- `YOUR_BOT1_TOKEN` / `YOUR_CHANNEL1_ID` — 1-minute clips
- `YOUR_BOT2_TOKEN` / `YOUR_CHANNEL2_ID` — restart clips
- `YOUR_BOT3_TOKEN` / `YOUR_CHANNEL3_ID` — final videos
- `YOUR_BOT4_TOKEN` / `YOUR_CHANNEL4_ID` — snapshots (every 100s)

Channel IDs look like: `-1001234567890`

---

## Step 3 — Deploy to GitHub Pages

1. Create a new GitHub repository (public)
2. Upload all files (keep folder structure)
3. Go to Settings → Pages → Source: main branch / root
4. Your site will be at: `https://yourusername.github.io/repo-name/`

---

## How "Sold" Works

The buyer (or admin) types `5$#5` into the price field of a video.
This marks it as sold and adds the price to the creator's balance.
When balance reaches $500, the Withdraw button unlocks.

---

## Adding More Languages

In `js/i18n.js`, find the `TRANSLATIONS` object.
Add all keys for your language inside the existing block, e.g.:

```js
tr: {
  'nav.how': 'Nasıl Çalışır',
  'hero.line1': 'Kameranız.',
  // ... all keys
}
```

The language buttons are already in the nav — they just need the translations filled in.
