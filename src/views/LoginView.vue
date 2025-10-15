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
    <div v-if="loginMsg">{{ loginMsg }}</div>
  </form>
</template>

<script setup lang="ts">
import { authInjectKey, UserLoginRequest } from "@/composables/useAuth";
import router from "@/router";
import { inject, reactive, ref } from "vue";

const userLoginRequest = reactive<UserLoginRequest>({
  username: "",
  password: "",
});

const loginMsg = ref<string>("");

const auth = inject(authInjectKey)!;

const handleLogin = async () => {
  loginMsg.value = "";
  try {
    await auth.login(userLoginRequest);
    loginMsg.value = "登录成功！3秒后回到主页";
    setTimeout(() => {
      router.push("/");
    }, 3000);
  } catch (error: any) {
    // console.log(error);
    loginMsg.value = error.response?.data.data.message;
  }
};
</script>

<style scoped></style>
