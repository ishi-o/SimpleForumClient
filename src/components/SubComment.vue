<template>
  <div class="scmt-profile">
    <UserReference
      :uid="scmt.authorId"
      :username="scmt.authorName"
      :targetAuthorId="scmt.targetAuthorId"
      :targetAuthorName="scmt.targetAuthorName"
    ></UserReference>
    <p class="scmt-description">{{ scmt.content }}</p>
    <p class="scmt-meta">
      {{ new Date(scmt.createdAt).toLocaleDateString() }}
    </p>
    <p class="scmt-meta">喜欢：{{ scmt.likes }}</p>
    <p class="scmt-meta">拉踩：{{ scmt.dislikes }}</p>
    <button @click="handleShowReplyEditor">回复</button>
  </div>
</template>

<script setup lang="ts">
import { Comment } from "@/composables/useComment";
import { defineEmits, defineProps } from "vue";
import UserReference from "./UserReference.vue";

interface CommentProps {
  scmt: Comment;
}

const props = defineProps<CommentProps>();

const emit = defineEmits(["reply"]);

const handleShowReplyEditor = () => {
  emit("reply", props.scmt, false);
};
</script>

<style scoped lang="scss">
.scmt-profile {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.scmt-profile:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.scmt-name h2 {
  margin-top: 0;
  color: #007bff;
}

.scmt-description {
  color: #666;
}

.scmt-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
