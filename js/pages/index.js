import { $, esc, setYear, setHTML } from "../lib/dom.js";
import { fetchProjects } from "../lib/projectsApi.js";

function uniqTags(items){
  const set = new Set();
  items.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b) => a.localeCompare(b, "ru"));
}

export async function initIndex(){
  setYear("#y");

  const grid = $("#projectsGrid");
  const filters = $("#tagFilters");
  const btnMore = $("#btnMore");

  if (!grid || !filters || !btnMore) return;

  let all = [];
  const activeTags = new Set();  // multi-select
  let limit = 9;

  function isActive(val){
    return activeTags.has(val);
  }

  function renderTags(){
    const tags = uniqTags(all);
    filters.innerHTML = "";

    const mk = (label, val, kind = "tag") => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = kind + (val && isActive(val) ? " active" : "");
      b.textContent = label;

      const pressed = val ? (isActive(val) ? "true" : "false") : (activeTags.size === 0 ? "true" : "false");
      b.setAttribute("aria-pressed", pressed);

      b.onclick = () => {
        if (!val){
          // "Все" = сброс
          activeTags.clear();
        } else {
          // toggle
          if (activeTags.has(val)) activeTags.delete(val);
          else activeTags.add(val);
        }
        limit = 9;
        renderTags();
        renderGrid();
      };
      return b;
    };

    // "Все" всегда первым
    filters.appendChild(mk("Все", ""));

    tags.forEach(t => filters.appendChild(mk(t, t)));
  }

  function passesFilter(p){
    if (activeTags.size === 0) return true;

    // AND logic: project must contain ALL selected tags
    for (const t of activeTags){
      if (!(p.tags || []).includes(t)) return false;
    }
    return true;
  }

  function card(p){
    const href = `project.html?id=${encodeURIComponent(p.slug)}`;
    const parts = [];
    if (p.city) parts.push(p.city);
    if (p.type) parts.push(p.type);
    if (p.areaM2) parts.push(p.areaM2 + " м²");
    const meta = parts.join(" • ");

    return `
      <a class="card" href="${href}">
        <div class="card-media" aria-hidden="true"></div>
        <div class="card-body">
          <div class="card-title">${esc(p.title || "Проект")}</div>
          <div class="meta"><span>${esc(meta)}</span></div>
        </div>
      </a>
    `;
  }

  function renderGrid(){
    let items = all.filter(passesFilter);
    const visible = items.slice(0, limit);
    grid.innerHTML = visible.map(card).join("");
    btnMore.style.display = (items.length > limit) ? "inline-flex" : "none";
  }

  btnMore.onclick = () => { limit += 9; renderGrid(); };

  try{
    all = await fetchProjects({ cache: "no-store" });
    renderTags();
    renderGrid();
  }catch(e){
    setHTML("#tagFilters", `<div class="panel">Не удалось загрузить data/projects.json</div>`);
  }
}
