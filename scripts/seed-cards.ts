import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Expected SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or anon variants) in .env.local",
  );
}
const supabase = createClient(supabaseUrl, supabaseKey);

const SET_ID = "swsh3";
const LOCALE = "en";

async function seedCards() {
  const res = await fetch(`https://api.tcgdex.net/v2/${LOCALE}/sets/${SET_ID}`);
  const set = await res.json();

  console.log(`Seeding ${set.cards.length} cards from "${set.name}"...`);

  for (const brief of set.cards) {
    const cardRes = await fetch(
      `https://api.tcgdex.net/v2/${LOCALE}/cards/${brief.id}`,
    );
    const card = await cardRes.json();

    const { data: insertedCard, error } = await supabase
      .from("cards")
      .upsert(
        {
          tcgdex_id: card.id,
          locale: LOCALE,
          name: card.name,
          local_id: card.localId,
          set_id: SET_ID,
          set_name: set.name,
          rarity: card.rarity ?? null,
          category: card.category ?? null,
          illustrator: card.illustrator ?? null,
          image_base: card.image ? `${card.image}/high.webp` : null,
        },
        { onConflict: "tcgdex_id,locale" },
      )
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert ${card.name}:`, error.message);
      continue;
    }

    if (card.types?.length && insertedCard) {
      const typeRows = card.types.map((t: string) => ({ id: t }));
      await supabase.from("types").upsert(typeRows, { onConflict: "id" });

      const cardTypeRows = card.types.map((t: string) => ({
        card_id: insertedCard.id,
        type_id: t,
      }));
      await supabase
        .from("card_types")
        .upsert(cardTypeRows, { onConflict: "card_id,type_id" });
    }

    console.log(`${card.name} (${card.id})`);

    await new Promise((r) => setTimeout(r, 100));
  }

  console.log("Done!");
}

seedCards().catch(console.error);
