import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PokemonType } from "@/components/icons/types";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { TYPES } from "@/lib/constants/types";
import { CardGrid } from "@/components/browse/card-grid";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    direction?: string;
    page?: string;
    set?: string;
    rarities?: string;
    types?: string;
  }>;
}) {
  const searchParams = await searchParamsPromise;
  const supabase = await createClient();

  const searchQuery = searchParams.query ?? "";
  const sortField = searchParams.sort ?? "name";
  const sortDirection = searchParams.direction ?? "asc";

  const page = Number(searchParams.page ?? 1);
  const pageSize = 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Parse filter params
  const activeSet = searchParams.set ?? "";
  const activeRarities = searchParams.rarities
    ? searchParams.rarities.split(",")
    : [];
  const activeTypes = searchParams.types
    ? searchParams.types
        .split(",")
        .filter((t): t is PokemonType =>
          (TYPES as readonly string[]).includes(t),
        )
    : [];
  const hasTypeFilter = activeTypes.length > 0;

  const { data: rawSets } = await supabase
    .from("cards")
    .select("set_name")
    .not("set_name", "is", null);

  const sets = [
    ...new Set((rawSets ?? []).map((r) => r.set_name as string)),
  ].sort();

  let query = supabase
    .from("cards")
    .select(hasTypeFilter ? "*, card_types!inner(type_id)" : "*", {
      count: "exact",
    });

  if (activeSet) query = query.eq("set_name", activeSet);
  if (activeRarities.length > 0) query = query.in("rarity", activeRarities);
  if (hasTypeFilter)
    query = query.filter(
      "card_types.type_id",
      "in",
      `(${activeTypes.join(",")})`,
    );

  if (searchQuery)
    query = query.or(
      `name.ilike.%${searchQuery}%,local_id.ilike.%${searchQuery}%`,
    );

  const orderColumn =
    sortField === "number"
      ? "local_id_int"
      : sortField === "name"
        ? "name"
        : "created_at";

  const { data: cards, count } = await query // 'count' for pagination later.
    .order(orderColumn, { ascending: sortDirection === "asc" })
    .order("set_id", { ascending: true }) // secondary: group same numbers by set
    .range(from, to);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-[320px_1fr] gap-8">
          <aside className="h-fit">
            {/* Filter panel box */}
            <Card className="mt-12 max-h-[calc(100vh-7.5rem)] w-full overflow-y-auto">
              <FiltersPanel
                sets={sets}
                initialSet={activeSet || undefined}
                initialRarities={activeRarities}
                initialTypes={activeTypes}
              />
              <div className="pt-2 m-4 flex gap-2">
                <Switch id="owned-cards-only" />
                <Label htmlFor="owned-cards-only">Show owned cards only</Label>
              </div>
            </Card>
          </aside>

          <section className="flex flex-col gap-6 pt-11">
            {/* Toolbar */}
            <BrowseToolbar
              initialQuery={searchQuery}
              initialSort={sortField}
              initialDirection={searchParams.direction ?? "asc"}
            ></BrowseToolbar>
            <CardGrid cards={cards ?? []} />
            {/* pagination component goes here */}
          </section>
        </div>
      </div>
    </main>
  );
}
