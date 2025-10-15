<template>
  <nav class="top-toolbar">
    <router-link to="/" class="brand">首页</router-link>
    <div class="nav-links">
      <button @click="theme.toggleTheme">
        {{ theme.isDark.value ? "☀️" : "🌙" }}
      </button>
      <div v-if="auth.loggedIn.value" class="user-info">
        <router-link :to="'/' + auth.user.value.uid" class="username">{{
          auth.user.value.username
        }}</router-link>
        <button @click="handleLogout">登出</button>
      </div>
      <div v-else class="guest-links">
        <router-link to="/login">
          <button>登录</button>
        </router-link>
        <router-link to="/register">
          <button>注册</button>
        </router-link>
        <button @click="handleRefresh">刷新</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { authInjectKey } from "@/composables/useAuth";
import { themeInjectKey } from "@/composables/useTheme";
import router from "@/router";
import { inject } from "vue";

const auth = inject(authInjectKey)!;
const theme = inject(themeInjectKey)!;

const handleLogout = async () => {
  await auth.logout();
  await auth.getGuestUser();
  router.push("/");
};

const handleRefresh = () => {
  window.location.reload();
};
</script>

<style scoped lang="scss">
.top-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--container-bg-color-light);
  border-bottom: 1px solid var(--border-color-light);
  margin-bottom: 20px;
  border-radius: 8px;
  transition: background-color 0.3s, border-color 0.3s;
}

.brand {
  font-weight: bold;
  font-size: 20px;
}

.nav-links,
.user-info,
.guest-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  font-weight: bold;
}
</style>
