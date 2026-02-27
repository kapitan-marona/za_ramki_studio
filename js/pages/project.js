import { $, esc, setText, setVisible, setYear, setHTML } from "../lib/dom.js";
import { fetchProjects } from "../lib/projectsApi.js";

function getId(){
  const params = new URLSearchParams(location.search);
  return (params.get("id") || "").trim();
}

function showNotFound(){
  document.title = "Проект не найден — ЗА РАМКИ";
  setText("#ptitle", "Проект не найден");
  setHTML("#pmeta", "");
  setVisible("#psummaryWrap", false);
  setVisible("#ptaskWrap", false);
  setVisible("#psolutionWrap", false);
  setVisible("#galleryEmpty", true);
  setHTML("#gallery", "");
}

export async function initProject(){
  setYear("#y");

  const id = getId();
  if (!id) return showNotFound();

  try{
    const items = await fetchProjects({ cache: "no-store" });
    const p = items.find(x => (x.slug || "") === id);
    if (!p) return showNotFound();

    document.title = (p.title ? p.title + " — " : "") + "ЗА РАМКИ";
    setText("#ptitle", p.title || "Проект");

    const metaParts = [];
    if (p.city) metaParts.push(esc(p.city));
    if (p.type) metaParts.push(esc(p.type));
    if (p.areaM2) metaParts.push(esc(p.areaM2) + " м²");
    setHTML("#pmeta", metaParts.map(x => `<span>${x}</span>`).join("<span>•</span>"));

    const summary = (p.summary || "").trim();
    const task = (p.task || "").trim();
    const solution = (p.solution || "").trim();

    setVisible("#psummaryWrap", !!summary);
    setVisible("#ptaskWrap", !!task);
    setVisible("#psolutionWrap", !!solution);

    setText("#psummary", summary);
    setText("#ptask", task);
    setText("#psolution", solution);

    const imgs = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
    setVisible("#galleryEmpty", imgs.length === 0);

    setHTML("#gallery", imgs.map(src => `
      <a class="card" href="${esc(src)}" target="_blank" rel="noopener">
        <div class="card-media" style="background-image:url('${esc(src)}'); background-size:cover; background-position:center;" aria-hidden="true"></div>
        <div class="card-body">
          <div class="meta"><span>Открыть изображение</span></div>
        </div>
      </a>
    `).join(""));

  }catch(e){
    showNotFound();
  }
}
