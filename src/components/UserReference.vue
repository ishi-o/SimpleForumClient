<template>
  <router-link :to="'/' + props.uid" class="username">{{
    props.username
  }}</router-link>
  <div v-if="targetAuthorId !== null">
    <p>to</p>
    <router-link :to="'/' + props.targetAuthorId" class="username">{{
      props.targetAuthorName
    }}</router-link>
  </div>
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
  targetAuthorId: {
    type: Number,
    default: null,
  },
  targetAuthorName: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
.username {
  font-weight: bold;
}
</style>
