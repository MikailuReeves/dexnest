"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialQuery?: string;
  initialSort?: string;
  initialDirection?: string; // sort direction e.g. ascending/descending
};

export function BrowseToolbar({
  initialQuery,
  initialSort,
  initialDirection,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState<string>(initialQuery ?? "");
  const [sort, setSort] = React.useState<string>(initialSort ?? "");
  const [direction, setDirection] = React.useState<string>(
    initialDirection ?? "",
  );

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    if (direction) {
      params.set("direction", direction);
    } else {
      params.delete("direction");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.replace(pathname);
  };

  return (
    <Field>
      <ButtonGroup>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          id="input-button-group"
          placeholder="Type to search..."
        />
        <Button onClick={handleApply} variant="outline">
          Search
        </Button>
      </ButtonGroup>
    </Field>
  );
}
