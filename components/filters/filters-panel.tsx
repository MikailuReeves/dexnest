"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FunnelPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetCombobox } from "@/components/filters/set-combobox";
import { SetRaritySelector } from "@/components/filters/rarity-select";
import { TypeFilter } from "@/components/filters/type-filter";
import { RARITIES } from "@/lib/constants/rarity";
import { PokemonType } from "@/components/icons/types";

type Props = {
  sets: string[];
  initialSet?: string;
  initialRarities?: string[];
  initialTypes?: PokemonType[];
};

export function FiltersPanel({
  sets,
  initialSet,
  initialRarities = [],
  initialTypes = [],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [set, setSet] = React.useState<string>(initialSet ?? "");
  const [rarities, setRarities] = React.useState<string[]>(initialRarities);
  const [types, setTypes] = React.useState<PokemonType[]>(initialTypes);

  // Key derived from URL params
  // Each filter child uses useState initialized from props, which won re-run after
  // mount. A key change forces a full remount re-initializing their state to empty.
  const filterKey = searchParams.toString();

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (set) {
      params.set("set", set);
    } else {
      params.delete("set");
    }
    if (rarities.length > 0) {
      params.set("rarities", rarities.join(","));
    } else {
      params.delete("rarities");
    }
    if (types.length > 0) {
      params.set("types", types.join(","));
    } else {
      params.delete("types");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSet("");
    setRarities([]);
    setTypes([]);
    router.replace(pathname);
  };

  return (
    <>
      <div className="flex items-center m-4">
        <FunnelPlus className="text-primary" size={20} />
        <span className="ml-2 text-base font-semibold tracking-wide">
          Filters
        </span>
        <Button
          variant="link_muted"
          className="ml-auto h-auto p-0"
          onClick={handleReset}
          disabled={searchParams.size === 0}
        >
          Reset All
        </Button>
      </div>

      <p className="pt-2 m-3 text-sm font-semibold tracking-tight">
        Set / Expansion
      </p>
      <div className="m-3">
        <SetCombobox
          key={`set-${filterKey}`}
          items={sets}
          value={set}
          action={(v) => setSet(v)}
        />
      </div>

      <p className="pt-2 m-3 text-sm font-semibold tracking-tight">Rarity</p>
      <div className="m-3">
        <SetRaritySelector
          key={`rarities-${filterKey}`}
          items={RARITIES}
          values={rarities}
          action={(v) => setRarities(v)}
        />
      </div>

      <p className="pt-2 m-3 text-sm font-semibold tracking-tight">Types</p>
      <div className="m-3">
        <TypeFilter
          key={`types-${filterKey}`}
          values={types}
          action={(v) => setTypes(v)}
        />
      </div>

      <div className="m-4 mt-2">
        <Button className="w-full" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </>
  );
}
