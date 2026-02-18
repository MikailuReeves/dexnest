"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function SetRaritySelector({
  items,
  values,
  action: onChange,
}: {
  items: string[];
  values?: string[];
  action?: (v: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(values || []);
  const clearAll = () => {
    setSelected([]);
    onChange?.([]);
  };

  const toggleRarity = (rarity: string) => {
    const newSelected = selected.includes(rarity)
      ? selected.filter((r) => r !== rarity)
      : [...selected, rarity];

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const selectAll = () => {
    setSelected(items);
    onChange?.(items);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
        >
          {selected.length === 0
            ? "Select rarities..."
            : `${selected.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          {/* Select All / Clear buttons */}
          <div className="flex border-b justify-between">
            <Button
              onClick={selectAll}
              variant="link_muted"
              className="text-xs text-muted-foreground"
            >
              Select All
            </Button>
            <Button
              onClick={clearAll}
              variant="link_muted"
              className="text-xs text-muted-foreground"
            >
              Clear
            </Button>
          </div>

          <CommandList>
            <CommandGroup>
              {items.map((rarity) => {
                const isSelected = selected.includes(rarity);

                return (
                  <CommandItem
                    key={rarity}
                    value={rarity}
                    onSelect={() => toggleRarity(rarity)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100 text-primary" : "opacity-0",
                      )}
                    />
                    <span>{rarity}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((rarity) => (
            <div
              key={rarity}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              <span>{rarity}</span>
              <button
                onClick={() => toggleRarity(rarity)}
                className="opacity-70 hover:opacity-100"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </Popover>
  );
}
