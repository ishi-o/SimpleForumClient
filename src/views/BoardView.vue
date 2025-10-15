<template>
  <h2>{{ board!.name }}</h2>
  <p class="board-description">{{ board!.description }}</p>
  <p class="board-meta">
    创建于: {{ new Date(board!.createdAt).toLocaleDateString() }}
  </p>
  <div @scroll="handleScroll" ref="scrollContainer" class="board-container">
    <div v-for="(post, index) in posts" :key="index">
      <PostProfile :post="post"></PostProfile>
    </div>
    <h2 v-if="posts.length === 0">该版块没有帖子！</h2>
    <h2 v-else-if="noData === true">已经到底了！</h2>
  </div>
</template>

<script setup lang="ts">
import PostProfile from "@/components/PostProfile.vue";
import { Board } from "@/composables/useBoard";
import { Post } from "@/composables/usePost";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const board = ref<Board>({
  bid: 0,
  name: "",
  description: "",
  moderatorId: 0,
  createdAt: new Date(),
});

const route = useRoute();

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const loading = ref(false);

const noData = ref(false);

const fetchPosts = async () => {
  try {
    const resp = await apiAxios.get<ApiResponse<Post[]>>(
      "/boards/" + board.value.bid + "/posts",
      {
        params: {
          page: currPage.value,
          size: pageSize.value,
        },
      }
    );
    const newPage = resp.data.data;
    if (newPage.length !== 0) {
      posts.value = [...posts.value, ...newPage];
      ++currPage.value;
    } else {
      noData.value = true;
    }
  } catch (error: any) {
    console.log(error);
  }
};

let scrollTimer: number | null = null;
const handleScroll = async () => {
  if (loading.value || noData.value) {
    return;
  }
  if (!scrollContainer.value) {
    return;
  }
  const scroller = scrollContainer.value;
  const scrollHeight = scroller.scrollHeight;
  const scrollTop = scroller.scrollTop;
  const clientHeight = scroller.clientHeight;
  const threshold = 100;
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  scrollTimer = setTimeout(async () => {
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loading.value = true;
      await fetchPosts().finally(() => {
        loading.value = false;
      });
    }
  }, 100);
};

const posts = ref<Post[]>([]);

onMounted(async () => {
  try {
    const resp = await apiAxios.get<ApiResponse<Board>>(
      "/boards/" + route.params.bid
    );
    board.value = resp.data.data;
  } catch (error: any) {
    console.log(error);
  }
  await fetchPosts();
});
</script>

<style scoped>
.board-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
