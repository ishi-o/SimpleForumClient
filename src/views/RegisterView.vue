<template>
  <form @submit.prevent="handleRegister">
    <input
      type="text"
      v-model="userRegisterRequest.username"
      placeholder="输入用户名"
      required
    />
    <input
      type="password"
      v-model="userRegisterRequest.password"
      placeholder="输入密码"
      required
    />
    <input
      type="password"
      v-model="repeatPwd"
      placeholder="再次输入密码"
      required
    />
    <div v-if="!isPwdMatch">两次输入的密码不一致！</div>
    <button type="submit" :disabled="!isPwdMatch">注册</button>
    <div v-if="registerMsg">{{ registerMsg }}</div>
  </form>
</template>

<script setup lang="ts">
import { UserLoginRequest } from "@/composables/useAuth";
import router from "@/router";
import apiAxios from "@/utils/axios";
import { computed, reactive, ref } from "vue";

const userRegisterRequest = reactive<UserLoginRequest>({
  username: "",
  password: "",
});

const repeatPwd = ref("");

const registerMsg = ref("");

const isPwdMatch = computed(
  () => repeatPwd.value === userRegisterRequest.password
);

const handleRegister = async () => {
  registerMsg.value = "";
  await apiAxios
    .post("/auth/register", {
      ...userRegisterRequest,
    })
    .then(() => {
      registerMsg.value = "注册成功！3秒后跳转到登录页";
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    })
    .catch((error) => {
      registerMsg.value = error.response?.data.data.message;
    });
};
</script>

<style scoped></style>
