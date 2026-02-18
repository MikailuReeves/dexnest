import { Bird } from "lucide-react";
import { Button } from "./ui/button";
import { AuthButton } from "./auth-button";
import { Suspense } from "react";

function AuthFallback() {
  return (
    <div className="flex gap-2">
      <div className="h-9 w-20 rounded-md bg-muted" />
      <div className="h-9 w-20 rounded-md bg-muted" />
    </div>
  );
}

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Bird className="h-6 w-6 text-primary" />
          <span className="font-brand text-lg font-semibold tracking-wide">
            dexnest
          </span>
        </div>
        {/* Center: Nav */}
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="/browse" className="hover:text-foreground transition">
            Browse
          </a>
          <a href="/collection" className="hover:text-foreground transition">
            Collection
          </a>
          <a href="/collection" className="hover:text-foreground transition">
            About
          </a>
        </nav>
        {/* Right: Nav */}
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Suspense fallback={<AuthFallback />}>
            <AuthButton />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
