<template>
  <div class="mcmt-profile">
    <UserReference
      :uid="mcmt.authorId"
      :username="mcmt.authorName"
    ></UserReference>
    <p class="mcmt-description">{{ mcmt.content }}</p>
    <p class="mcmt-meta">
      {{ new Date(mcmt.createdAt).toLocaleDateString() }}
    </p>
    <p class="mcmt-meta">喜欢：{{ mcmt.likes }}</p>
    <p class="mcmt-meta">拉踩：{{ mcmt.dislikes }}</p>
    <button @click="toggleShowReplyEditor(mcmt, true)">回复</button>
    <button @click="handleExpand">
      {{
        isExpand ? "收起总共" + replies.totalElements + "条回复" : "查看回复"
      }}
    </button>
    <div v-if="isExpand && replies.totalPages > 0">
      <div v-for="(reply, index) in replies.content" :key="index">
        <SubComment :scmt="reply" @reply="toggleShowReplyEditor"></SubComment>
      </div>
      <button v-if="!replies.first" @click="handlePreviousPage">&lt;</button>
      <p>{{ "页码: " + (replies.pageNumber + 1) }}</p>
      <button v-if="!replies.last" @click="handleNextPage">&gt;</button>
    </div>
    <form v-if="isShowEditor" @submit.prevent="handleCreateReply">
      <input
        type="text"
        :placeholder="'回复 ' + targetAuthorName"
        v-model="content"
        required
      />
      <button type="submit">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Comment } from "@/composables/useComment";
import { PageResult } from "@/composables/usePage";
import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { defineProps, ref } from "vue";
import SubComment from "./SubComment.vue";
import UserReference from "./UserReference.vue";

interface CommentProps {
  mcmt: Comment;
  bid: number;
  pid: number;
}

const props = defineProps<CommentProps>();

const replies = ref<PageResult<Comment>>({
  content: [],
  pageNumber: -1,
  pageSize: 4,
  totalElements: -1,
  totalPages: -1,
  first: true,
  last: true,
});

const fetchSubComments = async (pageNumber: number, pageSize: number) => {
  await apiAxios
    .get<ApiResponse<PageResult<Comment>>>(
      "/boards/" +
        props.bid +
        "/posts/" +
        props.pid +
        "/comments/" +
        props.mcmt.cid,
      {
        params: {
          page: pageNumber,
          size: pageSize,
        },
      }
    )
    .then((resp) => {
      replies.value = resp.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const handlePreviousPage = async () => {
  await fetchSubComments(replies.value.pageNumber - 1, replies.value.pageSize);
};

const handleNextPage = async () => {
  await fetchSubComments(replies.value.pageNumber + 1, replies.value.pageSize);
};

const isExpand = ref<boolean>(false);

const handleExpand = async () => {
  if (replies.value.pageNumber === -1) {
    await fetchSubComments(0, 4);
  }
  isExpand.value = !isExpand.value;
};

const isShowEditor = ref<boolean>(false);
const content = ref<string>("");
const targetId = ref<number>(0);
const targetAuthorName = ref<string>("");
const targetType = ref<boolean>(true);
const toggleShowReplyEditor = (cmt: Comment, type: boolean) => {
  if (isShowEditor.value) {
    if (targetId.value === cmt.cid) {
      isShowEditor.value = false;
    } else {
      targetId.value = cmt.cid;
      targetAuthorName.value = cmt.authorName;
      targetType.value = type;
    }
  } else {
    targetId.value = cmt.cid;
    targetAuthorName.value = cmt.authorName;
    targetType.value = type;
    isShowEditor.value = true;
  }
};

const handleCreateReply = async () => {
  await apiAxios
    .post(
      "/boards/" +
        props.bid +
        "/posts/" +
        props.pid +
        "/comments/" +
        props.mcmt.cid +
        (targetType.value ? "" : "/replies/" + targetId.value),
      content.value,
      {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
        },
      }
    )
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
.mcmt-profile {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.3s ease;
}

.mcmt-profile:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mcmt-name h2 {
  margin-top: 0;
  color: #007bff;
}

.mcmt-description {
  color: #666;
}

.mcmt-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
