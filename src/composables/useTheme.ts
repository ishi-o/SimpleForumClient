import { ref, computed, watch, InjectionKey, Ref } from "vue";

export type Theme = "light" | "dark";

export interface UseThemeReturn {
  theme: Ref<Theme>;
  toggleTheme: () => void;
  isDark: Ref<boolean>;
}

export const themeInjectKey: InjectionKey<UseThemeReturn> = Symbol("theme");

export const useTheme = (): UseThemeReturn => {
  const theme = ref<Theme>((localStorage.getItem("theme") as Theme) || "light");

  const isDark = computed(() => theme.value === "dark");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  watch(
    theme,
    (newTheme) => {
      localStorage.setItem("theme", newTheme);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(newTheme);
    },
    { immediate: true }
  );

  return {
    theme,
    toggleTheme,
    isDark,
  };
};
