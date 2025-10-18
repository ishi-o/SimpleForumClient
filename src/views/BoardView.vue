<template>
  <h2>{{ board.name }}</h2>
  <p class="board-description">{{ board.description }}</p>
  <p class="board-meta">
    创建于: {{ new Date(board.createdAt).toLocaleDateString() }}
  </p>
  <button v-if="!showEditor" @click="handleShowEditor">发表帖子！</button>
  <div v-else>
    <form @submit.prevent="handleCreatePost">
      <input
        type="text"
        placeholder="输入帖子标题"
        v-model="postCreateRequest.title"
        required
      />
      <input
        type="text"
        placeholder="输入帖子内容"
        v-model="postCreateRequest.content"
        required
      />
      <button type="submit">创建！</button>
    </form>
  </div>
  <div @scroll="handleScroll" ref="scrollContainer" class="board-container">
    <div v-for="(post, index) in posts" :key="index">
      <button v-if="post.isPinned" @click="handlePin(post)">取消置顶</button>
      <button v-else @click="handlePin(post)">置顶</button>
      <PostProfile :post="post"></PostProfile>
    </div>
    <h2 v-if="posts.length === 0">该版块没有帖子！</h2>
    <h2 v-else-if="noData === true">已经到底了！</h2>
  </div>
  <h1 v-if="errorMsg.length > 0">{{ errorMsg }}</h1>
</template>

<script setup lang="ts">
import PostProfile from "@/components/PostProfile.vue";
import { Board } from "@/composables/useBoard";
import { Post, PostCreateRequest } from "@/composables/usePost";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
const board = ref<Board>({
  bid: 0,
  name: "",
  description: "",
  moderatorId: 0,
  createdAt: new Date(),
});

const showEditor = ref<boolean>(false);

const handleShowEditor = () => {
  showEditor.value = true;
};

const postCreateRequest = reactive<PostCreateRequest>({
  title: "",
  content: "",
});

const handleCreatePost = async () => {
  await apiAxios
    .post("/boards/" + board.value.bid + "/posts", {
      ...postCreateRequest,
    })
    .then(() => {
      showEditor.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
  window.location.reload();
};

const route = useRoute();

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const loading = ref(false);

const noData = ref(false);

const errorMsg = ref<string>("");

const fetchPosts = async () => {
  await apiAxios
    .get<ApiResponse<Post[]>>("/boards/" + board.value.bid + "/posts", {
      params: {
        page: currPage.value,
        size: pageSize.value,
      },
    })
    .then((resp) => {
      const newPage = resp.data.data;
      if (newPage.length !== 0) {
        posts.value = [...posts.value, ...newPage];
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
      await fetchPosts().finally(() => {
        loading.value = false;
      });
    }
  }, 100);
};

const handlePin = async (post: Post) => {
  await apiAxios
    .patch("/boards/" + post.bid + "/post-pin/" + post.pid)
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
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
