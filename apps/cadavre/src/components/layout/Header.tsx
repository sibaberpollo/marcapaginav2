"use client";

import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <nav className="navbar max-w-6xl mx-auto px-4 min-h-16">
        <div className="navbar-start">
          <Link
            href="/"
            className="font-black text-xl tracking-tight text-base-content hover:text-brand-yellow transition-colors"
          >
            Cadavre
          </Link>
        </div>

        <div className="navbar-end">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
