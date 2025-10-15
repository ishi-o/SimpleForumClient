import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/global.scss";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

const app = createApp(App)
  .use(router)
  .use(Particles, {
    init: async (engine: Engine) => {
      await loadSlim(engine);
    },
  });

app.mount("#app");
