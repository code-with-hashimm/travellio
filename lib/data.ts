// ─── Hero ───────────────────────────────────────────────
export const heroImages = {
  sphinx: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80",
  mountain:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  bridge: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
  building:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
};

export const heroVideo = "/hero-bg.mp4";

// ─── About ──────────────────────────────────────────────
export const aboutImage =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80";

// ─── Experience → What We Hunt ──────────────────────────
export const experienceCards = [
  {
    id: "flights",
    title: "Flight Deals",
    location: "Airlines",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80",
    alignment: "top" as const,
    description: "Cheapest routes found across all airlines instantly."
  },
  {
    id: "hotels",
    title: "Hotel Deals",
    location: "Accommodation",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    alignment: "bottom" as const,
    description: "Best rates from Booking, Airbnb and 50+ more platforms."
  },
  {
    id: "packages",
    title: "Holiday Packages",
    location: "Bundles",
    image:
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80",
    alignment: "top" as const,
    description: "Complete trip bundles at slashed prices in one click."
  },
  {
    id: "alerts",
    title: "Price Alerts",
    location: "Notifications",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    alignment: "bottom" as const,
    description: "Get notified the moment deals drop to your target price."
  }
];

// ─── Destinations ───────────────────────────────────────
export const destinationBackgrounds = [
  {
    id: "mumbai-dubai",
    name: "",
    title: "",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"
  },
  {
    id: "delhi-bangkok",
    name: "",
    title: "",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80"
  },
  {
    id: "mumbai-singapore",
    name: "",
    title: "",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80"
  },
  {
    id: "india-bali",
    name: "",
    title: "",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
  }
];

// ─── Tours → AI Deal Cards ──────────────────────────────
export const tours = [
  {
    id: "dubai-deal",
    name: "",
    durationLabel: "",
    price: 0,
    originalPrice: 0,
    savings: 0,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
  },
  {
    id: "santorini-deal",
    name: "",
    durationLabel: "",
    price: 0,
    originalPrice: 0,
    savings: 0,
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"
  },
  {
    id: "safari-deal",
    name: "",
    durationLabel: "",
    price: 0,
    originalPrice: 0,
    savings: 0,
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
  },
  {
    id: "tokyo-deal",
    name: "",
    durationLabel: "",
    price: 0,
    originalPrice: 0,
    savings: 0,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80"
  }
];

// ─── Why Us → Product Features ──────────────────────────
export const whyUsImage =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80";

export const productFeatures = [
  {
    icon: "🤖",
    title: "AI-Powered Engine",
    description:
      "Not just filters. Our model learns what deals match your style and budget."
  },
  {
    icon: "⚡",
    title: "Real-Time Search",
    description:
      "Scans 500+ sources simultaneously. Results in under 2 seconds."
  },
  {
    icon: "🔔",
    title: "Smart Price Alerts",
    description:
      "Set your budget. We'll notify you the moment prices drop."
  },
  {
    icon: "📊",
    title: "Price History Graphs",
    description:
      "See if today's price is actually a good deal versus the last 90 days."
  }
];

// ─── Testimonials ───────────────────────────────────────
export const testimonials = [
  {
    id: "riya",
    name: "",
    role: "",
    quote:
      "",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
  },
  {
    id: "arjun",
    name: "",
    role: "",
    quote:
      "",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80"
  },
  {
    id: "priya",
    name: "",
    role: "",
    quote:
      "",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80"
  }
];

// ─── Blogs → Team ───────────────────────────────────────
export const teamMembers = [
  {
    id: "member-1",
    name: "Hashim",
    role: "Fullstack Developer",
    badge: "Fullstack",
    badgeColor: "cyan",
    initials: "HA",
    photo: "/member-1.png",
    github: "https://github.com/code-with-hashimm",
    linkedin: "https://www.linkedin.com/in/hashnode",
    portfolio: "https://hashim-portfolio.in"
  },
  {
    id: "member-2",
    name: "Mohammad",
    role: "Frontend Developer",
    badge: "Frontend",
    badgeColor: "teal",
    initials: "MO",
    photo: "/member-2.png",
    github: "https://github.com/mohammedmalvi",
    linkedin: "https://linkedin.com/in/mohammed-malvi-7a3851311"
  }
];

// keep blogs export for backwards compatibility
export const blogs = teamMembers.map((m) => ({
  id: m.id,
  title: m.name,
  date: m.role,
  image: ""
}));

// ─── FAQ ────────────────────────────────────────────────
export const faqsLeft = [
  {
    question: "How does the AI find deals?",
    answer:
      "Our AI engine scans 500+ travel platforms simultaneously, comparing prices across airlines, hotels, and package providers. It then ranks results using a proprietary scoring algorithm that factors in price history, seat availability, and seasonal patterns."
  },
  {
    question: "Which platforms do you scan?",
    answer:
      "We scan major booking platforms including MakeMyTrip, Skyscanner, Google Flights, Booking.com, Airbnb, Agoda, Kayak, and 490+ more sources — all in real-time."
  },
  {
    question: "How fast does it search?",
    answer:
      "Average search time is 1.8 seconds. Our scraping engine runs on edge functions distributed globally, so results come back almost instantly regardless of your location."
  },
  {
    question: "Is it free to use?",
    answer:
      "The core deal-finding engine is completely free. We plan to offer premium features like price alerts and price history graphs in future versions."
  }
];

export const faqsRight = [
  {
    question: "How is this different from Google Flights?",
    answer:
      "Google Flights only searches a limited set of airlines. We scan 500+ sources including OTAs, hotel aggregators, and package providers — then use AI to rank results by true value, not just price."
  },
  {
    question: "Do you store my search data?",
    answer:
      "No. Your searches are processed in real-time and not stored on our servers. We believe in privacy-first design — your travel plans are your business."
  },
  {
    question: "Can I set price alerts?",
    answer:
      "Price alerts are on our Phase 2 roadmap and coming soon. You'll be able to set a target price and get notified via email or push notification when deals drop."
  },
  {
    question: "What is the tech stack?",
    answer:
      "Built with Next.js 14, Tailwind CSS, Framer Motion for animations, OpenAI API for deal ranking, Puppeteer for real-time scraping, and deployed on Vercel edge functions."
  }
];

// ─── Stories → Roadmap ──────────────────────────────────
export const roadmapPhases = [
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Shipped ✅",
    status: "shipped" as const,
    items: [
      { label: "Core AI engine", done: true },
      { label: "500+ source scraping", done: true },
      { label: "Real-time ranking", done: true },
      { label: "Deal results UI", done: true }
    ]
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "In Progress 🔨",
    status: "in-progress" as const,
    items: [
      { label: "Price alerts", done: false },
      { label: "User accounts", done: false },
      { label: "Search history", done: false },
      { label: "Push notifications", done: false }
    ]
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Planned 📋",
    status: "planned" as const,
    items: [
      { label: "Browser extension", done: false },
      { label: "Mobile app", done: false },
      { label: "AI trip planner", done: false },
      { label: "Calendar sync", done: false }
    ]
  },
  {
    id: "phase-4",
    phase: "Phase 4",
    title: "Vision 🔮",
    status: "vision" as const,
    items: [
      { label: "Group travel deals", done: false },
      { label: "Loyalty optimizer", done: false },
      { label: "Carbon tracker", done: false },
      { label: "B2B API", done: false }
    ]
  }
];

// keep stories export for backwards compatibility
export const stories = roadmapPhases.map((p) => ({
  id: p.id,
  title: p.title,
  image:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
}));

// ─── Tech Stack ─────────────────────────────────────────
export const techStackItems = [
  {
    name: "Next.js 14",
    description: "App Router and Server Components",
    logo: "▲"
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling",
    logo: "🎨"
  },
  {
    name: "Framer Motion",
    description: "Animations and transitions",
    logo: "✦"
  },
  {
    name: "OpenAI API",
    description: "Deal ranking and recommendations",
    logo: "🧠"
  },
  {
    name: "Puppeteer",
    description: "Real-time price scraping",
    logo: "🕷️"
  },
  {
    name: "Vercel",
    description: "Deployment and edge functions",
    logo: "▲"
  }
];

// ─── Stats Bar ──────────────────────────────────────────
export const statsBarData = [
  { value: 500, suffix: "+", label: "Sources Scanned" },
  { value: 43, suffix: "%", label: "Average Savings Found" },
  { value: 1.8, suffix: "s", label: "Average Search Time" },
  { value: 48, suffix: "hrs", label: "Built at TinyFish" }
];