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
  let activeTag = "";
  let limit = 9;

  function renderTags(){
    const tags = uniqTags(all);
    filters.innerHTML = "";

    const mk = (label, val) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tag" + (activeTag === val ? " active" : "");
      b.textContent = label;
      b.setAttribute("aria-pressed", activeTag === val ? "true" : "false");
      b.onclick = () => {
        activeTag = (activeTag === val) ? "" : val;
        limit = 9;
        renderTags();
        renderGrid();
      };
      return b;
    };

    filters.appendChild(mk("Все", ""));
    tags.forEach(t => filters.appendChild(mk(t, t)));
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
    let items = all.slice();
    if (activeTag){
      items = items.filter(p => (p.tags || []).includes(activeTag));
    }
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
