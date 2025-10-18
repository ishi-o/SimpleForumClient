<template>
  <div class="user-profile">
    <h2>用户资料</h2>
    <dl>
      <dt>用户ID</dt>
      <dd>{{ user.uid }}</dd>
      <dt>用户名：</dt>
      <dd>{{ user.username }}</dd>
      <dt>用户创建日期：</dt>
      <dd>{{ new Date(user.createdAt).toLocaleString() }}</dd>
      <dt>用户角色：</dt>
      <dd>{{ roleMap[user.role] }}</dd>
    </dl>
    <div v-if="auth.user.value.uid === Number(route.params.uid)">
      <h2>您管理的版块</h2>
      <div
        @scroll="handleScroll"
        ref="scrollContainer"
        class="userboard-container"
      >
        <div v-for="(board, index) in boards" :key="index">
          <button @click="removeBoard(board)">删除</button>
          <BoardProfile :board="board"></BoardProfile>
        </div>
        <h2 v-if="boards.length === 0">暂未有版块！</h2>
        <h2 v-else-if="noData === true">已经到底了！</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardProfile from "@/components/BoardProfile.vue";
import {
  authInjectKey,
  defaultGuest,
  roleMap,
  User,
} from "@/composables/useAuth";
import { Board } from "@/composables/useBoard";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const auth = inject(authInjectKey)!;

const route = useRoute();

const loading = ref(false);

const noData = ref(false);

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const errorMsg = ref<string>("");

const fetchBoards = async () => {
  await apiAxios
    .get<ApiResponse<Board[]>>("/users/" + user.value.uid + "/boards", {
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
  console.log(boards);
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

const user = ref<User>(defaultGuest);

const removeBoard = async (board: Board) => {
  await apiAxios.delete("/boards/" + board.bid);
  window.location.reload();
};

onMounted(async () => {
  await apiAxios
    .get<ApiResponse<User>>("/users/" + route.params.uid)
    .then((resp) => {
      user.value = resp.data.data;
    })
    .catch((error) => {
      errorMsg.value = error.response?.data.data.message;
    });
  await fetchBoards();
});
</script>

<style scoped lang="scss">
.user-profile {
  background-color: var(--container-bg-color-light);
  padding: 30px;
  border-radius: 8px;
  box-shadow: var(--container-shadow-light);
  max-width: 600px;
  margin: 20px auto;
  transition: background-color 0.3s, box-shadow 0.3s;
}

h2 {
  margin-top: 0;
  color: var(--text-color-light);
  border-bottom: 2px solid var(--link-color-light);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
}

dt {
  font-weight: bold;
  color: #555;
  grid-column: 1;
}

dd {
  margin-left: 0;
  grid-column: 2;
  background-color: var(--dd-bg-color-light);
  padding: 8px;
  border-radius: 4px;
}

.userboard-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
