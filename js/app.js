import { initIndex } from "./pages/index.js";
import { initProject } from "./pages/project.js";

const page = document.body?.dataset?.page || "";

if (page === "index") initIndex();
if (page === "project") initProject();
