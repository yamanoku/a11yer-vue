import { createApp, defineComponent, h } from "vue";
import { A11yer } from "../src/index";

const TestApp = defineComponent({
  name: "TestApp",
  setup() {
    return () =>
      h(A11yer, null, {
        default: () =>
          h("main", null, [
            h("h1", null, "A11yer E2E Test Page"),

            // Image without alt — should get alt from filename
            h("img", { src: "/images/hero-banner.jpg" }),

            // Tracking pixel — should get alt=""
            h("img", { src: "/pixel.gif", width: 1, height: 1 }),

            // Form without labels
            h("form", null, [
              h("span", null, "Email Address"),
              h("input", { type: "email", name: "email" }),
              h("input", { name: "fname", placeholder: "First name" }),
              h("span", null, "Required Field"),
              h("input", { required: true }),
              h(
                "div",
                { class: "error", id: "err-test" },
                "This field is required",
              ),
            ]),

            // Table without scope
            h("table", null, [
              h("thead", null, [
                h("tr", null, [h("th", null, "Name"), h("th", null, "Age")]),
              ]),
              h("tbody", null, [
                h("tr", null, [h("td", null, "Alice"), h("td", null, "30")]),
              ]),
            ]),

            // Non-native button without keyboard handler
            h("div", { role: "button", onClick: () => {} }, "Click me"),

            // Icon-only button
            h("button", { title: "Close dialog" }, [
              h("svg", { viewBox: "0 0 24 24", width: 24, height: 24 }, [
                h("path", {
                  d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
                }),
              ]),
            ]),

            // Tablist
            h("div", { role: "tablist" }, [
              h("div", { role: "tab", "aria-selected": "true" }, "Tab 1"),
              h("div", { role: "tab" }, "Tab 2"),
              h("div", { role: "tab" }, "Tab 3"),
            ]),

            // Tooltip
            h("span", { id: "tip1", role: "tooltip" }, "Helpful tooltip text"),

            // Low contrast text
            h(
              "p",
              { style: "color: #999999; background-color: #ffffff;" },
              "This text has low contrast",
            ),
          ]),
      });
  },
});

const app = createApp(TestApp);
app.mount("#root");
