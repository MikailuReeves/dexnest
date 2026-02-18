// components/filters/type-filter.tsx
"use client";

import * as React from "react";
import { TypeTile } from "@/components/filters/type-tile";
import { TYPE_ICON_MAP, PokemonType } from "@/components/icons/types";

type Props = {
  values?: PokemonType[];
  action?: (v: PokemonType[]) => void;
};

export function TypeFilter({ values = [], action }: Props) {
  const [selected, setSelected] = React.useState<PokemonType[]>(values);

  const types = Object.keys(TYPE_ICON_MAP) as PokemonType[];

  const toggle = (t: PokemonType) => {
    const next = selected.includes(t)
      ? selected.filter((x) => x !== t)
      : [...selected, t];
    setSelected(next);
    action?.(next);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {types.map((t) => (
        <TypeTile
          key={t}
          type={t}
          selected={selected.includes(t)}
          action={() => toggle(t)}
          iconSize="h-6 w-6"
        />
      ))}
    </div>
  );
}
