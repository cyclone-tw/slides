import { SlideModuleLifecycle } from "./_shared/slide-lifecycle.js";

const SESSION_ID = "20260814-save-token-system";
const STORAGE_PREFIX = `${SESSION_ID}-`;

const deckShell = document.querySelector(".deck-shell");
const slides = [...document.querySelectorAll(".slide")];
const nav = document.querySelector("#slideNav");
const pageInfo = document.querySelector("#pageInfo");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const toc = document.querySelector(".toc");
const tocToggle = document.querySelector("#tocToggle");

const slideModules = {
  "local-reveal": (slide) => {
    const items = [...slide.querySelectorAll(".reveal-item")];
    const timers = [];
    items.forEach((item) => item.classList.remove("revealed"));
    items.forEach((item, index) => {
      timers.push(window.setTimeout(() => {
        if (slide.classList.contains("active")) item.classList.add("revealed");
      }, index * 240));
    });
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      items.forEach((item) => item.classList.remove("revealed"));
    };
  },
  "local-poll": (slide) => {
    const container = slide.querySelector("#votePoll");
    const result = slide.querySelector("#voteResult");
    const buttons = [...(container?.querySelectorAll("button") || [])];
    const key = `${STORAGE_PREFIX}vote`;
    const saved = readLocalValue(key);

    if (saved) {
      setActiveVote(buttons, saved);
      result.textContent = `本機暫存結果：你選了「${buttonLabel(saved)}」。僅本機投票，無同步。`;
    }

    const onVote = (event) => {
      const button = event.target.closest("button");
      const option = button?.dataset.option;
      if (!option) return;
      writeLocalValue(key, option);
      setActiveVote(buttons, option);
      result.textContent = `本機暫存結果：你選了「${buttonLabel(option)}」。僅本機投票，無同步。`;
    };

    container?.addEventListener("click", onVote);
    return () => container?.removeEventListener("click", onVote);
  }
};

const slideLifecycle = new SlideModuleLifecycle({
  modules: slideModules,
  onError: (error, context) => {
    context?.slide?.setAttribute?.("data-module-error", "true");
    console.error("[deck-module] " + (context?.name || "declaration") + ": " + error.message);
  }
});

let current = readInitialSlide();

buildNav();
updateTocState();
renderSlide();

prevBtn?.addEventListener("click", () => goTo(current - 1));
nextBtn?.addEventListener("click", () => goTo(current + 1));
window.addEventListener("hashchange", () => {
  const next = readInitialSlide();
  if (next !== current) goTo(next, false);
});
window.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName)) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goTo(current + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goTo(current - 1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1);
  }
});

tocToggle?.addEventListener("click", () => {
  deckShell.classList.toggle("toc-collapsed");
  updateTocState();
});

window.addEventListener("resize", () => {
  if (window.innerWidth <= 900) {
    deckShell.classList.add("toc-collapsed");
    tocToggle?.setAttribute("aria-expanded", "false");
    if (tocToggle) tocToggle.style.display = "none";
  } else {
    if (tocToggle) tocToggle.style.display = "inline-flex";
    updateTocState();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) slideLifecycle.deactivate();
  else slideLifecycle.activate(slides[current]);
});

window.addEventListener("pagehide", () => slideLifecycle.destroy(), { once: true });

function buildNav() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    const text = `${index + 1}. ${slide.dataset.title || "未命名"}`;
    button.textContent = text;
    button.addEventListener("click", () => goTo(index));
    nav.append(button);
  });
}

function goTo(index, announce = true) {
  const next = Math.max(0, Math.min(slides.length - 1, index));
  if (next === current && announce) return;
  current = next;
  renderSlide();
}

function renderSlide() {
  slides.forEach((slide, index) => {
    const isActive = index === current;
    slide.classList.toggle("active", isActive);
    if (nav.children[index]) nav.children[index].classList.toggle("active", isActive);
  });

  pageInfo.textContent = `${current + 1} / ${slides.length}`;
  const hash = `slide-${current + 1}`;
  if (location.hash.slice(1) !== hash) {
    history.replaceState(null, "", `#${hash}`);
  }

  slideLifecycle.activate(slides[current]);
}

function buttonLabel(key) {
  const map = {
    token: "Token 用量爆掉",
    cost: "費用太高",
    latency: "回應延遲",
    quality: "品質波動"
  };
  return map[key] || key;
}

function setActiveVote(buttons, target) {
  buttons.forEach((button) => button.classList.toggle("active", button.dataset.option === target));
}

function readLocalValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 無 localStorage 時仍保留本次畫面的選取狀態。
  }
}

function updateTocState() {
  if (!tocToggle) return;

  const isCollapsed = deckShell.classList.contains("toc-collapsed");
  const expanded = !isCollapsed;
  tocToggle.setAttribute("aria-expanded", String(expanded));
  tocToggle.setAttribute("aria-label", expanded ? "目錄收合" : "目錄展開");

  if (window.innerWidth <= 900) {
    deckShell.classList.add("toc-collapsed");
    tocToggle.style.display = "none";
    return;
  }

  tocToggle.style.display = "inline-flex";
}

function readInitialSlide() {
  const match = location.hash.match(/slide-(\d+)/);
  const parsed = match ? Number(match[1]) - 1 : 0;
  return Math.max(0, Math.min(slides.length - 1, isFinite(parsed) ? parsed : 0));
}

// 初始化 900px 以下隱藏目錄開關
if (window.innerWidth <= 900) {
  deckShell.classList.add("toc-collapsed");
  if (tocToggle) tocToggle.style.display = "none";
}

export { SESSION_ID };
