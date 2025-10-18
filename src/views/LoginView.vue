<template>
  <form @submit.prevent="handleLogin">
    <input
      type="text"
      v-model="userLoginRequest.username"
      placeholder="输入用户名"
      required
    />
    <input
      type="password"
      v-model="userLoginRequest.password"
      placeholder="输入密码"
      required
    />
    <button type="submit">登录</button>
    <h1 v-if="errorMsg.length > 0">{{ errorMsg }}</h1>
  </form>
</template>

<script setup lang="ts">
import { authInjectKey, UserLoginRequest } from "@/composables/useAuth";
import { inject, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const userLoginRequest = reactive<UserLoginRequest>({
  username: "",
  password: "",
});

const errorMsg = ref<string>("");

const auth = inject(authInjectKey)!;

const handleLogin = async () => {
  errorMsg.value = "";
  await auth
    .login(userLoginRequest)
    .then(() => {
      window.location.replace("/");
    })
    .catch((error) => {
      errorMsg.value = error.response?.data.data.message;
    });
};
</script>

<style scoped></style>
