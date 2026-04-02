import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  type PropType,
  ref,
  shallowRef,
  watch,
} from "vue";
import { DomScanner } from "../engine/DomScanner";
import { StyleInjector } from "../engine/StyleInjector";
import type { A11yerConfig } from "../types";
import { defaultA11yConfig } from "../types";
import { mountAnnouncer } from "../utils/announce";
import {
  getReducedMotionSnapshot,
  subscribeToReducedMotion,
} from "../utils/mediaQuery";
import { SkipLink } from "./SkipLink";

export interface A11yerProps {
  config?: A11yerConfig;
}

/**
 * Wrap your app in <A11yer> and accessibility is automatically handled.
 * No hooks to call, no props to spread, no components to replace.
 */
export const A11yer = defineComponent({
  name: "A11yer",
  props: {
    config: { type: Object as PropType<A11yerConfig>, default: undefined },
  },
  setup(props, { slots }) {
    const a11y = computed(() => ({ ...defaultA11yConfig, ...props.config?.a11y }));

    const browserPrefersReducedMotion = ref(false); // SSR-safe default

    const prefersReducedMotion = computed(() => {
      if (a11y.value.reducedMotion === "always") return true;
      if (a11y.value.reducedMotion === "never") return false;
      return browserPrefersReducedMotion.value;
    });

    const styleInjector = new StyleInjector();
    const scannerRef = shallowRef<DomScanner | null>(null);

    watch(
      [
        () => a11y.value.focusVisible,
        () => a11y.value.focusStyle,
        prefersReducedMotion,
      ],
      () => {
        styleInjector.inject({
          focusVisible: a11y.value.focusVisible,
          focusStyle: a11y.value.focusStyle,
          reducedMotion: prefersReducedMotion.value,
        });
      },
      { immediate: true },
    );

    watch(a11y, (newConfig) => {
      scannerRef.value?.update(newConfig);
    });

    let unsubReducedMotion: (() => void) | null = null;
    let unmountAnnouncerFn: (() => void) | null = null;

    onMounted(() => {
      browserPrefersReducedMotion.value = getReducedMotionSnapshot();
      unsubReducedMotion = subscribeToReducedMotion(() => {
        browserPrefersReducedMotion.value = getReducedMotionSnapshot();
      });

      const scanner = new DomScanner({ config: a11y.value });
      scanner.start();
      scannerRef.value = scanner;

      unmountAnnouncerFn = mountAnnouncer();
    });

    onUnmounted(() => {
      scannerRef.value?.stop();
      styleInjector.remove();
      unsubReducedMotion?.();
      unmountAnnouncerFn?.();
    });

    return () => [h(SkipLink), ...(slots.default?.() ?? [])];
  },
});
