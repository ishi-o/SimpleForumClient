<template>
  <div class="user-profile">
    <h2>用户资料</h2>
    <dl>
      <dt>用户ID</dt>
      <dd>{{ auth.user.value.uid }}</dd>
      <dt>用户名：</dt>
      <dd>{{ auth.user.value.username }}</dd>
      <dt>用户创建日期：</dt>
      <dd>{{ new Date(auth.user.value.createdAt).toLocaleString() }}</dd>
      <dt>用户角色：</dt>
      <dd>{{ roleMap[auth.user.value.role] }}</dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { authInjectKey, roleMap } from "@/composables/useAuth";
import { inject } from "vue";

const auth = inject(authInjectKey)!;
</script>

<style scoped lang="scss">
.user-profile {
  background-color: var(--container-bg-color-light);
  padding: 30px;
  border-radius: 8px;
  box-shadow: var(--container-shadow-light);
  max-width: 600px;
  margin: 20px auto;
  transition: background-color 0.3s, box-shadow 0.3s;
}

h2 {
  margin-top: 0;
  color: var(--text-color-light);
  border-bottom: 2px solid var(--link-color-light);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
}

dt {
  font-weight: bold;
  color: #555;
  grid-column: 1;
}

dd {
  margin-left: 0;
  grid-column: 2;
  background-color: var(--dd-bg-color-light);
  padding: 8px;
  border-radius: 4px;
}
</style>
