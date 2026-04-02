const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const INTERACTIVE_ROLES = new Set([
  "button",
  "link",
  "checkbox",
  "radio",
  "switch",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "tab",
  "treeitem",
  "slider",
  "spinbutton",
  "combobox",
  "searchbox",
  "textbox",
  "scrollbar",
]);

/** Check if an element already has an accessible name */
export function isAlreadyLabelled(el: Element): boolean {
  if (el.hasAttribute("aria-label")) return true;
  if (el.hasAttribute("aria-labelledby")) return true;
  if (el.hasAttribute("title")) return true;

  // Check for associated <label>
  if (el.id) {
    const label = el.ownerDocument?.querySelector(`label[for="${el.id}"]`);
    if (label) return true;
  }

  // Check for wrapping <label>
  if (el.closest("label")) return true;

  return false;
}

/** Check if an element is interactive */
export function isInteractive(el: Element): boolean {
  const tagName = el.tagName.toLowerCase();
  if (tagName === "a" && el.hasAttribute("href")) return true;
  if (tagName === "button") return true;
  if (tagName === "input" && el.getAttribute("type") !== "hidden") return true;
  if (tagName === "select" || tagName === "textarea") return true;

  const role = el.getAttribute("role");
  if (role && INTERACTIVE_ROLES.has(role)) return true;

  const tabindex = el.getAttribute("tabindex");
  if (tabindex !== null && tabindex !== "-1") return true;

  return false;
}

/** Deep text content extraction, excluding aria-hidden elements */
export function getTextContent(el: Element): string {
  if (el.getAttribute("aria-hidden") === "true") return "";

  let text = "";
  for (const child of el.childNodes) {
    if (child.nodeType === 3 /* TEXT */) {
      text += child.textContent || "";
    } else if (child.nodeType === 1 /* ELEMENT */) {
      text += getTextContent(child as Element);
    }
  }
  return text.trim();
}

/** Check if an element has an explicit role attribute */
export function hasExplicitRole(el: Element): boolean {
  return el.hasAttribute("role");
}

/** Mark an element as patched by a specific key */
export function markPatched(el: Element, key: string): void {
  el.setAttribute(`data-a11yer-vue-${key}`, "");
}

/** Check if an element has been patched by a specific key */
export function isPatched(el: Element, key: string): boolean {
  return el.hasAttribute(`data-a11yer-vue-${key}`);
}

/** Check if an element is visible (not display:none, hidden, etc.) */
export function isVisible(el: Element): boolean {
  if (el.hasAttribute("hidden")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;

  const htmlEl = el as HTMLElement;
  if (htmlEl.offsetParent === null && htmlEl.style?.display !== "fixed") {
    // offsetParent is null for display:none, but also for position:fixed
    // Double check: if it has no dimensions, it's hidden
    if (htmlEl.offsetWidth === 0 && htmlEl.offsetHeight === 0) return false;
  }

  return true;
}

/** Get all focusable elements within a container */
export function getFocusableElements(container: Element): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(elements).filter(
    (el) => !el.hasAttribute("disabled") && isVisible(el),
  );
}

/**
 * Check if an element is managed by an existing a11y library
 * (Headless UI, Ark UI, Vuetify, Element Plus, etc.)
 * These libraries manage their own ARIA attributes, focus traps,
 * and keyboard handlers — patching on top would break them.
 */
export function isManagedByLibrary(el: Element): boolean {
  // Headless UI (Vue + React): data-headlessui-state, data-headlessui
  if (el.hasAttribute("data-headlessui-state")) return true;
  if (el.hasAttribute("data-headlessui")) return true;

  // Ark UI / Zag: data-scope, data-part
  if (el.hasAttribute("data-scope") && el.hasAttribute("data-part"))
    return true;

  // shadcn/ui v2: data-slot
  if (el.hasAttribute("data-slot")) return true;

  const className = el.getAttribute("class") || "";

  // Vuetify: class names with v- prefix
  if (/\bv-[a-z]/.test(className)) return true;

  // Element Plus: class names with el- prefix
  if (/\bel-/.test(className)) return true;

  // PrimeVue: class names with p- prefix
  if (/\bp-[a-z]/.test(className)) return true;

  // Naive UI: class names with n- prefix
  if (/\bn-[a-z]/.test(className)) return true;

  return false;
}

let idCounter = 0;

/** Generate a unique ID for an element if it doesn't have one.
 *  Uses a deterministic counter (not Math.random) for security and SSR consistency. */
export function ensureId(el: Element, prefix: string): string {
  if (el.id) return el.id;
  const id = `${prefix}-${++idCounter}`;
  el.id = id;
  return id;
}
