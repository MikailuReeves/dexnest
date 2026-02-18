import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FunnelPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SetCombobox } from "@/components/filters/set-combobox";
import { SetRaritySelector } from "@/components/filters/rarity-select";
import { RARITIES } from "@/lib/constants/rarity";
import { TypeFilter } from "@/components/filters/type-filter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default async function Home() {
  const supabase = await createClient();

  const { data: sets, error } = await supabase
    .from("card_sets")
    .select("set_name");

  if (error) throw error;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-[320px_1fr] gap-8">
          <aside className="h-fit">
            {/* Filter panel box */}
            <Card className="w-full mt-12">
              <div className="flex items-center m-4">
                <FunnelPlus className="text-primary" size={20} />
                <span className="ml-2 text-base font-semibold tracking-wide">
                  Filters
                </span>
                <Button variant="link_muted" className="ml-auto h-auto p-0">
                  Reset All
                </Button>
              </div>
              <p className="pt-2 m-3 text-sm font-semibold tracking-tight">
                Set / Expansion
              </p>
              <div className="m-3">
                <SetCombobox items={sets?.map((s) => s.set_name) ?? []} />
              </div>
              <p className="pt-2 m-3 text-sm font-semibold tracking-tight">
                Rarity
              </p>
              <div className="m-3">
                <SetRaritySelector items={[...RARITIES]}></SetRaritySelector>
              </div>
              <p className="pt-2 m-3 text-sm font-semibold tracking-tight">
                Types
              </p>
              <div className="m-3">
                <TypeFilter />
              </div>
              <div className="pt-2 m-4 flex gap-2">
                <Switch id="owned-cards-only" />
                <Label htmlFor="owned-cards-only">Show owned cards only</Label>
              </div>
            </Card>
          </aside>

          <section className="flex flex-col gap-6">
            {/* Toolbar */}
            {/* Card grid */}
          </section>
        </div>
      </div>
    </main>
  );
}
