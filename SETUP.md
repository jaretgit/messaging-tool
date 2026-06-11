# Setup & Deployment

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and replace `your_api_key_here` with your Anthropic API key.

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel CLI (fastest — no GitHub needed)
```bash
npm install -g vercel
vercel
```
When prompted, add `ANTHROPIC_API_KEY` as an environment variable.

### Option B: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo
3. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Click Deploy

---

## Notes

- The API key is only used server-side — it is never exposed to the browser
- The tool uses `claude-sonnet-4-6` — adjust the model in `app/api/chat/route.ts` if needed
- To update campaign knowledge (key messages, question guidance, etc.), edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts`
