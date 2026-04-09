"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  initialQuery?: string;
};

function SortIndicator({
  direction,
  active,
}: {
  direction: string;
  active: boolean;
}) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      className="ml-1.5"
      aria-hidden="true"
    >
      <path
        d="M4 0L7 4H1L4 0Z"
        className={cn(
          active && direction === "asc"
            ? "fill-primary"
            : "fill-muted-foreground/25",
        )}
      />
      <path
        d="M4 12L1 8H7L4 12Z"
        className={cn(
          active && direction === "desc"
            ? "fill-primary"
            : "fill-muted-foreground/25",
        )}
      />
    </svg>
  );
}

export function BrowseToolbar({ initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derived from URL — automatically reflects external resets (e.g. FiltersPanel "Reset All")
  const sort = searchParams.get("sort") ?? "";
  const direction = searchParams.get("direction") ?? "";

  // Local state only for the search input (controlled, pushes on Enter/button)
  const [query, setQuery] = React.useState<string>(initialQuery ?? "");

  // Sync query input when URL clears externally
  React.useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  const handleSortToggle = (newField: string) => {
    const newDir =
      newField === sort ? (direction === "asc" ? "desc" : "asc") : "asc";

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("sort", newField);
    params.set("direction", newDir);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Clears only the search query, preserves all other params
  const handleReset = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <Field>
        <ButtonGroup>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            id="input-button-group"
            placeholder="Type to search..."
          />
          {query && (
            <Button onClick={handleReset} variant="outline" aria-label="Clear search">
              ×
            </Button>
          )}
          <Button onClick={handleApply} variant="outline">
            Search
          </Button>
        </ButtonGroup>
      </Field>

      <ToggleGroup
        type="single"
        value={sort}
        aria-label="Sort cards"
      >
        <ToggleGroupItem
          value="name"
          className="gap-0.5 text-xs font-semibold uppercase tracking-wider"
          onClick={() => handleSortToggle("name")}
        >
          Name
          <SortIndicator direction={direction} active={sort === "name"} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="number"
          className="gap-0.5 text-xs font-semibold uppercase tracking-wider"
          onClick={() => handleSortToggle("number")}
        >
          Number
          <SortIndicator direction={direction} active={sort === "number"} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
