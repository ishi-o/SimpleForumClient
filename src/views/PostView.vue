<template>
  <h1 v-if="errorMsg.length > 0">{{ errorMsg }}</h1>
  <div v-else>
    <UserReference
      :uid="post.authorId"
      :username="post.authorName"
    ></UserReference>
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
    <div @scroll="handleScroll" ref="scrollContainer" class="comment-container">
      <div v-for="(mcmt, index) in cmts" :key="index">
        <MainComment :mcmt="mcmt"></MainComment>
      </div>
      <h2 v-if="cmts.length === 0">该帖子没有评论！</h2>
      <h2 v-else-if="noData === true">已经到底了！</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainComment from "@/components/MainComment.vue";
import UserReference from "@/components/UserReference.vue";
import { Comment } from "@/composables/useComment";
import { Post } from "@/composables/usePost";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const post = ref<Post>({
  pid: 0,
  title: "",
  content: "",
  createdAt: new Date(),
  bid: 0,
  authorId: 0,
  authorName: "",
  isPinned: false,
  likes: 0,
  dislikes: 0,
});

const errorMsg = ref<string>("");

const route = useRoute();

const currPage = ref(0);

const pageSize = ref(8);

const scrollContainer = ref<HTMLElement>();

const loading = ref(false);

const noData = ref(false);

const fetchCmts = async () => {
  await apiAxios
    .get<ApiResponse<Comment[]>>(
      "/boards/" + post.value.bid + "/posts/" + post.value.pid + "/comments",
      {
        params: {
          page: currPage.value,
          size: pageSize.value,
        },
      }
    )
    .then((resp) => {
      const newPage = resp.data.data;
      if (newPage.length !== 0) {
        cmts.value = [...cmts.value, ...newPage];
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
      await fetchCmts().finally(() => {
        loading.value = false;
      });
    }
  }, 100);
};

const cmts = ref<Comment[]>([]);

onMounted(async () => {
  await apiAxios
    .get<ApiResponse<Post>>(
      "/boards/" + route.params.bid + "/posts/" + route.params.pid
    )
    .then((resp) => {
      post.value = resp.data.data;
    })
    .catch((error) => {
      errorMsg.value = error.response?.data.data.message;
    });
  await fetchCmts();
});
</script>

<style scoped>
.comment-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
