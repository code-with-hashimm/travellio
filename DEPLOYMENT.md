# 🚀 Deployment & Architecture Guide: TinyFish Deal Hunter

Welcome to the **TinyFish Deal Hunter** deployment guide. This project is a high-performance, multi-agent travel search engine that uses AI-driven browser automation to "Sniper" find the absolute cheapest travel deals across the web.

---

## 🏗️ 1. Architecture Overview

### Parallel Multi-Agent System
Unlike traditional scrapers that run sequentially, TinyFish Deal Hunter launches **concurrent browser sessions** (Agents) for every provider (e.g., Skyscanner, ixigo, redBus). 

- **Next.js Proxy Layer**: The frontend communicates with a specialized API route (`/api/agent-stream-parallel`) that triggers multiple external TinyFish runs.
- **Async Polling Model**: Instead of keeping a single HTTP request open (which would timeout on Vercel's Free Tier), the frontend uses an asynchronous polling mechanism. It tracks each `runId` independently, fetching status updates every 2 seconds.
- **Partial Loading (Incremental Results)**: As soon as the first agent finishes, the "Mission Control" UI renders its results immediately while other agents continue hunting in the background.

---

## ⚙️ 2. Environment Setup

To run this project locally or in production, you must configure the following environment variables in a `.env.local` file:

| Variable | Requirement | Description |
| :--- | :--- | :--- |
| `TINYFISH_API_KEY` | **Mandatory** | Your API key from [agent.tinyfish.ai](https://agent.tinyfish.ai). |
| `TINYFISH_BASE_URL` | Optional | Defaults to `https://agent.tinyfish.ai/v1`. |

> [!IMPORTANT]
> Without a valid `TINYFISH_API_KEY`, the agents will fail to launch browser sessions and no deals will be found.

---

## ☁️ 3. Deployment Steps (Vercel Optimized)

This project is optimized for **Vercel** and bypasses common serverless limitations.

### Step-by-Step Deployment:
1. **Push to GitHub**: Ensure your latest changes are in a repository.
2. **Import to Vercel**: Create a new project and select your repository.
3. **Configure Environment Variables**: Add your `TINYFISH_API_KEY` in the Vercel project settings.
4. **Deploy**: Click **Deploy**.

### 💡 Why we don't hit timeouts:
Standard Vercel serverless functions have a **10-second timeout** (Hobby) or **60-second timeout** (Pro). Since travel sites can take 30-45 seconds to load, a direct "Wait for result" approach would fail. Our **Async Polling** model handles the heavy lifting on TinyFish's infrastructure, meaning our Vercel functions only run for milliseconds at a time to check status.

---

## 🏆 4. Features for Judges

When reviewing this project, please note these state-of-the-art engineering implementations:

### 📺 Multi-Stream "Mission Control"
Located in the **Agent Panel**, users can switch between live browser feeds of different agents in real-time. This provides absolute transparency, showing exactly how the AI interacts with travel sites.

### 🎯 "Sniper" Smart Extraction
The AI Agent doesn't just scrape; it thinks. It is programmed to:
- **Sort First**: Automatically find and click "Cheapest" or "Sort by Price" filters.
- **OG Price Filtering**: Ignore secondary numbers like Taxes, Platform Fees, or Seats Left. It captures only the **Total Fare**.
- **Data Sanitization**: Automatically discards outlier prices (like partial fees) that fall below 10% of the page average.

### 💱 Currency Intelligence
The system detects the native currency of the site ($, ₹, £, €) and:
- **Normalizes** them for the backend sorting logic.
- **Converts** international prices (e.g., USD) to INR at a fixed rate for fair comparison.
- **Displays** the original currency symbol in the UI for user clarity.

---

## 🛠️ 5. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **0 Deals Found** | Site layout changes | Check the selectors in `route.ts`. Agents use semantic extraction, but rigid site changes may require a prompt update. |
| **404/502 Errors** | Run cancelled / expired | If a run is cancelled manually on the TinyFish dashboard, the UI will mark that specific source as `FAILED`. Simply "Hunt Again" to restart. |
| **Partial Loading Stuck** | Network instability | The UI will show "Agents still hunting..." if polling is interrupted. Ensure your internet connection is stable. |

---

*Built with ❤️ using Next.js, Framer Motion, and TinyFish AI.*
