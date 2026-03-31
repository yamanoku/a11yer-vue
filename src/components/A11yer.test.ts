import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { A11yer } from "./A11yer";

afterEach(() => {
  document.body.replaceChildren();
  document.getElementById("a11yer-styles")?.remove();
});

describe("A11yer", () => {
  it("renders children", () => {
    const wrapper = mount(A11yer, {
      slots: { default: '<div data-testid="child">Hello</div>' },
      attachTo: document.body,
    });
    expect(wrapper.find('[data-testid="child"]').text()).toBe("Hello");
  });

  it("injects skip link automatically", () => {
    mount(A11yer, {
      slots: { default: "<div>App</div>" },
      attachTo: document.body,
    });
    const skipLink = document.querySelector(".a11yer-skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink?.getAttribute("href")).toBe("#main-content");
  });

  it("accepts config override", () => {
    expect(() =>
      mount(A11yer, {
        props: { config: { a11y: { minContrastRatio: 7, autoImgAlt: false } } },
        slots: { default: "<div>App</div>" },
      }),
    ).not.toThrow();
  });

  it("renders with no config", () => {
    mount(A11yer, {
      slots: { default: "<main>Content</main>" },
      attachTo: document.body,
    });
    expect(document.querySelector("main")).toBeTruthy();
  });

  it("does not crash when autoContrastFix is false", () => {
    const wrapper = mount(A11yer, {
      props: { config: { a11y: { autoContrastFix: false } } },
      slots: { default: "<div>Safe</div>" },
    });
    expect(wrapper.text()).toContain("Safe");
  });

  it("does not crash when autoImgAlt is false", () => {
    const wrapper = mount(A11yer, {
      props: { config: { a11y: { autoImgAlt: false } } },
      slots: { default: "<div>Images disabled</div>" },
    });
    expect(wrapper.text()).toContain("Images disabled");
  });

  it("does not crash with an empty config object", () => {
    expect(() =>
      mount(A11yer, {
        props: { config: {} },
        slots: { default: "<div>Empty config</div>" },
      }),
    ).not.toThrow();
  });

  it("does not crash with no config prop at all", () => {
    expect(() =>
      mount(A11yer, {
        slots: { default: "<span>No config</span>" },
      }),
    ).not.toThrow();
  });

  it("injects style element into the document head", () => {
    mount(A11yer, {
      slots: { default: "<div>Styled</div>" },
    });
    const styleEl = document.getElementById("a11yer-styles");
    expect(styleEl).not.toBeNull();
  });

  it("applies reduced-motion=always config", () => {
    mount(A11yer, {
      props: { config: { a11y: { reducedMotion: "always" } } },
      slots: { default: "<div>Motion reduced</div>" },
    });
    const styleEl = document.getElementById("a11yer-styles");
    expect(styleEl?.textContent).toContain("prefers-reduced-motion");
  });
});
