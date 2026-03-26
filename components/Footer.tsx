"use client";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-surface-dark text-white">
      <div className="mx-auto max-w-[900px] px-6 py-16 md:px-10">
        {/* Top row — logo */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-display text-xl tracking-tight">
            <span>🎯</span>
            <span>Travel Deal Hunter</span>
            <span className="ml-1 inline-flex items-center rounded-md bg-accent-cyan/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-cyan">
              AI
            </span>
          </div>
          <p className="mt-2 text-sm text-white/50">
            AI-powered travel deal finder.
          </p>
        </div>

        {/* Link groups */}
        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Product
            </h4>
            <ul className="space-y-2 text-white/60">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">How It Works</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Live Demo</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Features</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Roadmap</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Hackathon
            </h4>
            <ul className="space-y-2 text-white/60">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">TinyFish 2025</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Devpost</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Pitch Deck</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">GitHub Repo</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Connect
            </h4>
            <ul className="space-y-2 text-white/60">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">GitHub</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">LinkedIn</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Twitter / X</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Legal
            </h4>
            <ul className="space-y-2 text-white/60">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Privacy Policy</li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline underline-offset-2">Terms of Use</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.08] pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <p>Built with ❤️ at TinyFish Hackathon 2025</p>
          <p>
            MIT License · Open Source ·{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan underline-offset-2 hover:underline"
            >
              ★ Star on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
