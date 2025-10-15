<template>
  <div class="board-profile">
    <router-link :to="'/board/' + board.bid" class="board-name">
      <h2>{{ board.name }}</h2>
    </router-link>
    <p class="board-description">{{ board.description }}</p>
    <p class="board-meta">
      创建于: {{ new Date(board.createdAt).toLocaleDateString() }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Board } from "@/composables/useBoard";
import { defineProps } from "vue";

interface BoardProps {
  board: Board;
}

const props = defineProps<BoardProps>();
</script>

<style scoped lang="scss">
.board-profile {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.board-profile:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.board-name h2 {
  margin-top: 0;
  color: #007bff;
}

.board-description {
  color: #666;
}

.board-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
