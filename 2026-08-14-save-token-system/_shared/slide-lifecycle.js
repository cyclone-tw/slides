const MODULE_NAME_PATTERN = /^[a-z][a-z0-9-]{0,31}$/;
const MAX_MODULES_PER_SLIDE = 8;

export const LIFECYCLE_CONTRACT_VERSION = "slide-lifecycle-v1";
export const FROZEN_LIFECYCLE_CONTRACTS = Object.freeze([LIFECYCLE_CONTRACT_VERSION]);

export function parseSlideModuleNames(value) {
  if (value === undefined || value === null || value === "") return [];
  if (typeof value !== "string") throw new TypeError("invalid_slide_modules");
  const names = [...new Set(value.trim().split(/\s+/).filter(Boolean))];
  if (names.length > MAX_MODULES_PER_SLIDE) throw new TypeError("too_many_slide_modules");
  if (names.some((name) => !MODULE_NAME_PATTERN.test(name))) {
    throw new TypeError("invalid_slide_module_name");
  }
  return names;
}

export class SlideModuleLifecycle {
  constructor({ modules = {}, onError = () => {} } = {}) {
    this.modules = { ...modules };
    this.onError = onError;
    this.activeSlide = null;
    this.cleanups = [];
  }

  activate(slide) {
    if (slide === this.activeSlide) return;
    this.deactivate();
    if (!slide) return;
    this.activeSlide = slide;

    let names;
    try {
      names = parseSlideModuleNames(slide.dataset?.slideModules);
    } catch (error) {
      this.report(error, { slide });
      return;
    }

    for (const name of names) {
      const mount = Object.hasOwn(this.modules, name) ? this.modules[name] : undefined;
      if (typeof mount !== "function") {
        this.report(new Error(`unknown_slide_module:${name}`), { name, slide });
        continue;
      }
      try {
        const cleanup = mount(slide);
        if (cleanup !== undefined && typeof cleanup !== "function") {
          throw new TypeError(`invalid_slide_module_cleanup:${name}`);
        }
        if (cleanup) this.cleanups.push({ name, cleanup });
      } catch (error) {
        this.report(error, { name, slide });
      }
    }
  }

  deactivate() {
    for (const entry of this.cleanups.reverse()) {
      try {
        entry.cleanup();
      } catch (error) {
        this.report(error, { name: entry.name, slide: this.activeSlide });
      }
    }
    this.cleanups = [];
    this.activeSlide = null;
  }

  destroy() {
    this.deactivate();
  }

  report(error, context) {
    try {
      this.onError(error instanceof Error ? error : new Error("slide_module_error"), context);
    } catch { /* error reporting must not break slide navigation */ }
  }
}
