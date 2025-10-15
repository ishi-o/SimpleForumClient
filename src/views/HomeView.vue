<template>
  <div @scroll="handleScroll" ref="scrollContainer" class="home-container">
    <div>
      {{ welcomeMsg }}
    </div>
    <div v-for="(board, index) in boards" :key="index">
      <BoardProfile :board="board"></BoardProfile>
    </div>
    <h2 v-if="boards.length === 0">该版块没有帖子！</h2>
    <h2 v-else-if="noData === true">已经到底了！</h2>
  </div>
</template>

<script setup lang="ts">
import BoardProfile from "@/components/BoardProfile.vue";
import { Board } from "@/composables/useBoard";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { onMounted, ref } from "vue";

const welcomeMsg = "欢迎来到Forum！";

const loading = ref(false);

const noData = ref(false);

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const fetchBoards = async () => {
  console.log("fetchBoards");
  try {
    const resp = await apiAxios.get<ApiResponse<Board[]>>("/boards", {
      params: {
        page: currPage.value,
        size: pageSize.value,
      },
    });
    const newPage = resp.data.data;
    if (newPage.length !== 0) {
      boards.value = [...boards.value, ...newPage];
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
      await fetchBoards().finally(() => {
        loading.value = false;
      });
    }
  }, 100);
};

const boards = ref<Board[]>([]);

onMounted(async () => {
  await fetchBoards();
});
</script>

<style scoped>
.home-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
