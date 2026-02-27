/**
 * projectsApi.js
 * - fetch + normalize (safe defaults)
 * Dev default: cache "no-store" (easy editing)
 */
export async function fetchProjects({
  url = "./data/projects.json",
  cache = "no-store"
} = {}){
  const r = await fetch(url, { cache });
  if (!r.ok) throw new Error("Failed to load projects.json: " + r.status);
  const data = await r.json();
  const list = Array.isArray(data) ? data : [];
  return list.map(normalizeProject);
}

export function normalizeProject(p){
  const x = (p && typeof p === "object") ? p : {};
  return {
    slug: (x.slug ?? "").toString(),
    title: (x.title ?? "").toString(),
    city: (x.city ?? "").toString(),
    type: (x.type ?? "").toString(),
    areaM2: (x.areaM2 ?? ""),
    tags: Array.isArray(x.tags) ? x.tags.filter(Boolean).map(String) : [],
    summary: (x.summary ?? "").toString(),
    task: (x.task ?? "").toString(),
    solution: (x.solution ?? "").toString(),
    images: Array.isArray(x.images) ? x.images.filter(Boolean).map(String) : []
  };
}
