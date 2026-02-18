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
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function SetCombobox({
  items,
  value,
  action: onChange,
}: {
  items: string[];
  value?: string;
  action?: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
        >
          {selected ?? "Select set..."}
          <ChevronsUpDown className="ml-2 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            className="outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-border"
            placeholder="Search sets..."
          />
          <CommandEmpty>No set found.</CommandEmpty>
          <CommandGroup>
            {items.map((name) => (
              <CommandItem
                key={name}
                value={name}
                onSelect={(current) => {
                  const next = current === selected ? undefined : current;
                  setSelected(next);
                  onChange?.(next ?? "");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-primary",
                    selected === name ? "opacity-100" : "opacity-0",
                  )}
                />
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
