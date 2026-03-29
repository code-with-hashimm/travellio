# ✈️ Travellio: The AI-Powered Multi-Agent Travel Hunter.

> **"Stop searching, start traveling. Let our AI swarm find the best deals for you."**

<p align="center">
  <img src="https://github.com/user-attachments/assets/29ba63e8-b4d9-45d4-8fb3-22a4315cc336" alt="Travellio Demo" width="800" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
</p>

---

## ⚡ The Problem: The "Booking Burnout"
Travelers today face two major hurdles:
1.  **Manual Comparison Struggle**: Checking Kayak, Cleartrip, Booking.com, and Abhibus individually is exhausting and time-consuming.
2.  **Bot-Detection Barriers**: Most platforms use aggressive Captchas and bot-detection, making transparent price tracking nearly impossible for standard tools.

---

## 🚀 Our Solution (The 'Win' Factor)

**Travellio** isn't just a search engine; it's a **Parallel Multi-Agent Hunting System**.

*   **Parallel Multi-Agent Dispatch**: We trigger **3+ specialized AI agents simultaneously** to scrape and navigate Kayak, Cleartrip, Abhibus, and more in real-time.
*   **Secret Sauce (Bot-Bypass)**: Our system uses **Deep-Linking** and **Stealth Mappers** to bypass Captchas and bot-detection, ensuring you get the most accurate, live data without the blocks.

---

## ⚙️ How It Works (System Architecture)

Our architecture is designed for speed and reliability:

**User Query** → **Parallel Agent Dispatch** → **Data Normalization** → **Real-time UI Update**

1.  **User Query**: You enter your destination and dates.
2.  **Parallel Dispatch**: Multiple TinyFish agents are launched instantly, each targeting a specific travel source.
3.  **Data Normalization**: Results from various sources are cleaned and unified into a single readable format.
4.  **Real-time Update**: We use **Server-Sent Events (SSE)** to stream results to your dashboard as they arrive—no waiting for the "slowest" site.

---

## ✨ Core Features

*   ✅ **Real-time Price Comparison**: Instant parity across Flights, Buses, and Hotels.
*   ✅ **AI-Generated Best Picks**: Let the AI highlight the "Value for Money" winner.
*   ✅ **Live Progress Streaming (SSE)**: Watch the agents work in real-time on your screen.
*   ✅ **Responsive Travel Dashboard**: A premium, mobile-first design for travelers on the move.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** |
| **Styling** | **Tailwind CSS** |
| **AI Orchestration** | **TinyFish AI SDK** |
| **Animations** | **Framer Motion** |
| **Icons** | **Lucide Icons** |

---

## 🚀 Quick Setup

Get **Travellio** running locally in 3 simple steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env.local` file and add your key:
    ```env
    TINYFISH_API_KEY=your_api_key_here
    ```
3.  **Launch the App**:
    ```bash
    npm run dev
    ```

---

## 🗺️ Future Roadmap

*   🎙️ **Voice-based Travel Booking**: Search for trips using natural language voice commands.
*   💬 **WhatsApp Integration**: Get real-time bait alerts and booking summaries directly on WhatsApp.
*   🤖 **Autonomous Re-booking**: Automated price-drop protection and re-booking.

---

Built with ❤️ for the next generation of travelers.
