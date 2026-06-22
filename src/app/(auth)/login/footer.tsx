import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="container mx-auto max-w-6xl flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            TwoTalesAI
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TwoTalesAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
