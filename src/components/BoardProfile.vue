<template>
  <router-link :to="'/board/' + board.bid">
    <h2>{{ board.name }}</h2>
  </router-link>
  <p>{{ board.description }}</p>
  <p>{{ board.createdAt }}</p>
</template>

<script setup lang="ts">
import { Board } from "@/composables/useBoard";
import { defineProps } from "vue";

interface BoardProps {
  board: Board;
}

const props = defineProps<BoardProps>();
</script>

<style scoped></style>
