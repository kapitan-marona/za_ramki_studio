export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const esc = (v) => (v ?? "").toString()
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");

export function setText(sel, val){
  const el = $(sel);
  if (!el) return;
  el.textContent = (val ?? "").toString();
}

export function setHTML(sel, html){
  const el = $(sel);
  if (!el) return;
  el.innerHTML = html ?? "";
}

export function setVisible(sel, isVisible){
  const el = $(sel);
  if (!el) return;
  el.style.display = isVisible ? "" : "none";
}

export function setYear(sel = "#y"){
  const el = $(sel);
  if (!el) return;
  el.textContent = new Date().getFullYear();
}
