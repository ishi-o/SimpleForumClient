<template>
  <div class="mcmt-profile">
    <UserReference
      :uid="mcmt.authorId"
      :username="mcmt.authorName"
    ></UserReference>
    <p class="mcmt-description">{{ mcmt.content }}</p>
    <p class="mcmt-meta">
      {{ new Date(mcmt.createdAt).toLocaleDateString() }}
    </p>
    <p class="mcmt-meta">喜欢：{{ mcmt.likes }}</p>
    <p class="mcmt-meta">拉踩：{{ mcmt.dislikes }}</p>
  </div>
</template>

<script setup lang="ts">
import { Comment } from "@/composables/useComment";
import { defineProps } from "vue";
import UserReference from "./UserReference.vue";

interface CommentProps {
  mcmt: Comment;
}

const props = defineProps<CommentProps>();
</script>

<style scoped lang="scss">
.mcmt-profile {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.mcmt-profile:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mcmt-name h2 {
  margin-top: 0;
  color: #007bff;
}

.mcmt-description {
  color: #666;
}

.mcmt-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
