<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goList = () => {
  router.push({ name: 'commentList' })
}
</script>
<template>
  <div class="comment-form bg-black">
    <h2 class="text-white"></h2>
    <div class="md:flex md:items-center mb-6 text-white">投稿が完了しました</div>
    <div class="buttons">
      <button
        type="button"
        class="text-white bg-gray border-2 border-gray-400 rounded"
        @click="goList"
      >
        一覧へ戻る
      </button>
    </div>
  </div>
</template>
<style scoped>
.comment-form {
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
}
</style>
