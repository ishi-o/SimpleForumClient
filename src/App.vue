<template>
  <TopToolbar></TopToolbar>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, provide } from "vue";
import TopToolbar from "./components/TopToolbar.vue";
import { authInjectKey, useAuth } from "./composables/useAuth";

const auth = useAuth();

onMounted(async () => {
  await auth.initAuth();
});

provide(authInjectKey, auth);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
