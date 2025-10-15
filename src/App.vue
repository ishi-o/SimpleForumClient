<template>
  <Particles
    id="tsparticles"
    :options="theme.isDark.value ? particlesDarkOptions : particlesLightOptions"
  />
  <div id="main-container">
    <TopToolbar></TopToolbar>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide } from "vue";
import TopToolbar from "./components/TopToolbar.vue";
import { authInjectKey, useAuth } from "./composables/useAuth";
import { themeInjectKey, useTheme } from "./composables/useTheme";

const auth = useAuth();
const theme = useTheme();

onMounted(async () => {
  await auth.initAuth();
});

provide(authInjectKey, auth);
provide(themeInjectKey, theme);

const particlesLightOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#23a6d5",
    },
    links: {
      color: "#23d5ab",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

const particlesDarkOptions = {
  ...particlesLightOptions,
  particles: {
    ...particlesLightOptions.particles,
    color: {
      value: "#66abff",
    },
    links: {
      ...particlesLightOptions.particles.links,
      color: "#ffffff",
    },
  },
};
</script>

<style lang="scss">
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
