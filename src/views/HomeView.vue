<template>
  <h1 v-if="errorMsg.length > 0">{{ errorMsg }}</h1>
  <button v-if="!showEditor" @click="handleShowEditor">
    创建属于你自己的版块！
  </button>
  <div v-else>
    <form @submit.prevent="handleCreateBoard">
      <input
        type="text"
        placeholder="输入版块标题"
        v-model="boardCreateRequest.name"
        required
      />
      <input
        type="text"
        placeholder="输入版块描述"
        v-model="boardCreateRequest.description"
        required
      />
      <button type="submit">创建！</button>
    </form>
  </div>
  <div @scroll="handleScroll" ref="scrollContainer" class="home-container">
    <div>
      {{ welcomeMsg }}
    </div>
    <div v-for="(board, index) in boards" :key="index">
      <BoardProfile :board="board"></BoardProfile>
    </div>
    <h2 v-if="boards.length === 0">暂未有版块！</h2>
    <h2 v-else-if="noData === true">已经到底了！</h2>
  </div>
</template>

<script setup lang="ts">
import BoardProfile from "@/components/BoardProfile.vue";
import { authInjectKey } from "@/composables/useAuth";
import { Board, BoardCreateRequest, useBoard } from "@/composables/useBoard";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { inject, onMounted, reactive, ref } from "vue";

const welcomeMsg = "欢迎来到Forum！";

const loading = ref(false);

const noData = ref(false);

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const errorMsg = ref<string>("");

const showEditor = ref<boolean>(false);

const handleShowEditor = () => {
  showEditor.value = true;
};

const auth = inject(authInjectKey)!;

const boardCreateRequest = reactive<BoardCreateRequest>({
  name: "",
  description: "",
  moderatorUid: auth.user.value.uid,
});

const board = useBoard();

const handleCreateBoard = async () => {
  boardCreateRequest.moderatorUid = auth.user.value.uid;
  await board
    .createBoard(boardCreateRequest)
    .then(() => {
      showEditor.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchBoards = async () => {
  await apiAxios
    .get<ApiResponse<Board[]>>("/boards", {
      params: {
        page: currPage.value,
        size: pageSize.value,
      },
    })
    .then((resp) => {
      const newPage = resp.data.data;
      if (newPage.length !== 0) {
        boards.value = [...boards.value, ...newPage];
        ++currPage.value;
      } else {
        noData.value = true;
      }
    })
    .catch((error) => {
      errorMsg.value = error.response?.data.data.message;
    });
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
