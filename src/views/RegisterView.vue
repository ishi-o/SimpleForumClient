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
  await apiAxios
    .post("/auth/register", {
      ...userRegisterRequest,
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped></style>
