"use client";

type Card = {
  id: string;
  name: string;
  image_base: string | null;
};

export function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="rounded-xl border bg-card p-2">
          {card.image_base && (
            <img
              src={card.image_base}
              alt={card.name}
              className="rounded-md"
            ></img>
          )}
          <p className="mt-2 text-sm font-medium">{card.name}</p>
        </div>
      ))}
    </div>
  );
}
