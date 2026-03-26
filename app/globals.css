@import url('https://fonts.cdnfonts.com/css/inter');
@import url('https://fonts.cdnfonts.com/css/jetbrains-mono-2');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

@font-face {
  font-family: "Cal Sans";
  src: url("https://fonts.gstatic.com/s/calsans/v2/fdN99sWUv3gWqXxqqSBevloE4LZx.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

:root {
  --font-cal-sans: "Cal Sans", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

body {
  @apply font-sans bg-black text-white;
}

.font-display {
  font-family: var(--font-cal-sans);
}

.gooey-filter {
  filter: url("#goo");
}

/* Dot-grid pattern for dark tech sections */
.dot-grid {
  background-image: radial-gradient(circle,
      rgba(255, 255, 255, 0.06) 1px,
      transparent 1px);
  background-size: 24px 24px;
}

/* Noise texture overlay */
.noise-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
  z-index: 1;
}

/* Shimmer sweep animation for banner */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.shimmer-sweep {
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(0, 212, 255, 0.08) 50%,
      transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

/* Count-up number animation helper */
@keyframes pulse-green {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.5);
  }

  50% {
    box-shadow: 0 0 8px 4px rgba(0, 255, 136, 0.3);
  }
}

.pulse-green {
  animation: pulse-green 2s ease-in-out infinite;
}

/* Typewriter cursor blink */
@keyframes blink-cursor {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.cursor-blink {
  animation: blink-cursor 0.8s step-end infinite;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 999px;
}