import { useTmdb } from "src/composables/useTmdb";

export async function availableRegions() {
  try {
    const { fetch } = useTmdb();
    const res = await fetch("watch/providers/regions");
    return res?.results || [];
  } catch (err) {
    console.error("Error fetching available regions:", err);
    return [];
  }
}
