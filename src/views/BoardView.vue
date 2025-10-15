<template>
  <div>
    <div v-if="loggedIn">
      <button>登出</button>
    </div>
    <div v-else>
      <button>注册</button>
      <button>登录</button>
    </div>
  </div>
  <div>
    {{ welcomeMsg }}
  </div>
</template>

<script setup lang="ts">
const welcomeMsg = "欢迎来到Forum！";

interface User {
  username: string;
}

const loggedIn = false;
</script>

<style scoped></style>
