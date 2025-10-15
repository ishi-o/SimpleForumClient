<template>
  <div class="post-profile">
    <router-link :to="'/p/' + post.pid" class="post-title">
      <h2>{{ post.title }}</h2>
    </router-link>
    <p class="post-meta">
      创建于: {{ new Date(post.createdAt).toLocaleDateString() }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Post } from "@/composables/usePost";
import { defineProps } from "vue";

interface PostProps {
  post: Post;
}

const props = defineProps<PostProps>();
</script>

<style scoped lang="scss">
.post-profile {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.post-profile:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-title h2 {
  margin-top: 0;
  color: #007bff;
}

.post-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
