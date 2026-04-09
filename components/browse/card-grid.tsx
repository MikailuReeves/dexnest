"use client";

import Image from "next/image";

type Card = {
  id: string;
  name: string;
  image_base: string | null;
  local_id: string | null;
};

export function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="rounded-xl border bg-card p-2">
          {card.image_base && (
            <Image
              src={card.image_base}
              alt={card.name}
              width={512}
              height={367}
              className="rounded-md"
            ></Image>
          )}
          <p className="mt-2 text-sm font-medium">{card.name}</p>
          {card.local_id && <p className="text-xs text-muted-foreground">#{card.local_id}</p>}
        </div>
      ))}
    </div>
  );
}
