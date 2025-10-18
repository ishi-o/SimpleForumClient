<template>
  <router-link :to="'/' + props.uid" class="username">{{
    props.username
  }}</router-link>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  uid: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.username {
  font-weight: bold;
}
</style>
