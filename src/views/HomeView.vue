<template>
  <h1 v-if="errorMsg.length > 0">{{ errorMsg }}</h1>
  <form @submit.prevent="searchBoards">
    <input
      type="text"
      placeholder="输入关键词搜索版块"
      v-model="keywords"
      required
    />
    <button type="submit">搜索</button>
  </form>
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
      <button
        v-if="auth.user.value.role === UserRole.ADMIN"
        @click="removeBoard(board)"
      >
        删除
      </button>
      <BoardProfile :board="board"></BoardProfile>
    </div>
    <h2 v-if="boards.length === 0">暂未有版块！</h2>
    <h2 v-else-if="noData === true">已经到底了！</h2>
  </div>
</template>

<script setup lang="ts">
import BoardProfile from "@/components/BoardProfile.vue";
import { authInjectKey, UserRole } from "@/composables/useAuth";
import { Board, BoardCreateRequest, useBoard } from "@/composables/useBoard";
import router from "@/router";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const welcomeMsg = "欢迎来到Forum！";

const loading = ref(false);

const noData = ref(false);

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const errorMsg = ref<string>("");

const showEditor = ref<boolean>(false);

const route = useRoute();

const keywords = ref<string>((route.query.q as string) || "");
const searchBoards = () => {
  router.push({
    path: "/",
    query: {
      q: keywords.value,
    },
  });
};

const handleShowEditor = () => {
  showEditor.value = true;
};

const auth = inject(authInjectKey)!;

const removeBoard = async (board: Board) => {
  await apiAxios.delete("/boards/" + board.bid);
  window.location.reload();
};

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
        q: route.query.q,
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
