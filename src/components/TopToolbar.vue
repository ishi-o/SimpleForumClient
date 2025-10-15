<template>
  <router-link to="/">
    <button>首页</button>
  </router-link>
  <div v-if="auth.loggedIn.value">
    <button @click="handleLogout">登出</button>
    <router-link :to="'/' + auth.user.value.uid">{{
      auth.user.value.username
    }}</router-link>
  </div>
  <div v-else>
    <router-link to="/login">
      <button>登录</button>
    </router-link>
    <router-link to="/register">
      <button>注册</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { authInjectKey } from "@/composables/useAuth";
import router from "@/router";
import { inject } from "vue";

const auth = inject(authInjectKey)!;

const handleLogout = async () => {
  await auth.logout();
  await auth.getGuestUser();
  router.push("/");
};
</script>

<style scoped></style>
