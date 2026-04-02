import { defineComponent, h, onMounted, ref } from "vue";

// Top 8 web languages by usage. Others fall back to English.
const L: Record<string, string> = {
  en: "Skip to main content",
  ja: "メインコンテンツへスキップ",
  zh: "跳到主要内容",
  ko: "주요 콘텐츠로 건너뛰기",
  es: "Saltar al contenido principal",
  fr: "Aller au contenu principal",
  de: "Zum Hauptinhalt springen",
  pt: "Pular para o conteúdo principal",
};

/** Internal skip navigation link. Label matches page language. */
export const SkipLink = defineComponent({
  name: "SkipLink",
  setup() {
    // Start with 'en' on both server and client to avoid SSR hydration mismatch.
    // onMounted updates to the actual page language after hydration.
    const lang = ref("en");

    onMounted(() => {
      lang.value = (
        document.documentElement.lang ||
        navigator?.language ||
        "en"
      )
        .split("-")[0]
        .toLowerCase();
    });

    return () =>
      h("a", { href: "#main-content", class: "a11yer-vue-skip-link" }, L[lang.value] || L.en);
  },
});
