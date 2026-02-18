"use client";

import { cn } from "@/lib/utils";
import { TYPE_ICON_MAP, PokemonType } from "@/components/icons/types";

type TypeTileProps = {
  type: PokemonType;
  selected: boolean;
  action: () => void;
  iconSize?: string;
};

export function TypeTile({
  type,
  selected,
  action: onClick,
  iconSize = "h-5 w-5",
}: TypeTileProps) {
  const Icon = TYPE_ICON_MAP[type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-16 w-full flex-col items-center justify-center gap-2 rounded-xl border transition tracking-tight",
        selected
          ? "bg-primary/10 border-primary/40"
          : "bg-card border-border hover:bg-muted/50",
      )}
    >
      <Icon className={cn(iconSize, "text-primary")} />
      <span className="text-xs font-medium">{type}</span>
    </button>
  );
}
