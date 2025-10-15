<template>
  <dl>
    <dt>用户ID</dt>
    <dd>{{ auth.user.value.uid }}</dd>
    <dt>用户名：</dt>
    <dd>{{ auth.user.value.username }}</dd>
    <dt>用户创建日期：</dt>
    <dd>{{ auth.user.value.createdAt }}</dd>
    <dt>用户角色：</dt>
    <dd>{{ roleMap[auth.user.value.role] }}</dd>
  </dl>
</template>

<script setup lang="ts">
import { authInjectKey, roleMap } from "@/composables/useAuth";
import { inject } from "vue";

const auth = inject(authInjectKey)!;
</script>

<style scoped></style>
