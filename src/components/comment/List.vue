<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { collection, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase/index.ts'
import { onMounted, ref, onUnmounted } from 'vue'
import type { Post } from '@/types/post.d'
import DeleteModal from './DeleteModal.vue'

const router = useRouter()
const uid = ref('')
const result = ref<Post[]>([])
const isModalOpen = ref(false)
const targetCommentId = ref<string | null>(null)
const fetchData = async () => {
  // Todo エラーハンドリングの実装
  // if (!getAuth().currentUser) {
  //     console.log('User not found')
  //     return
  // }
  result.value = []
  console.log(uid.value)
  const postsRef = collection(db, 'posts')
  const q = query(postsRef, where('userId', '==', uid.value))
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const createdAt = new Date(doc.data().createdAt.seconds).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      result.value.push({
        docId: doc.id,
        favName: doc.data().favName,
        fullName: doc.data().fullName,
        createdAt: createdAt,
        comment: doc.data().comment,
      })
      result.value.sort((a, b) => b.createdAt.localeCompare(a.createdAt, 'ja'))
    })
  }
}
const goList = () => {
  router.push({ name: 'commentList' })
}
const openModal = (item: Post) => {
  isModalOpen.value = true
  targetCommentId.value = item.docId
}
const onCloseDeleteModal = () => {
  isModalOpen.value = false
}
const deletePost = async () => {
  try {
    if (targetCommentId.value) {
      await deleteDoc(doc(db, 'posts', targetCommentId.value))
      await onCloseDeleteModal()
      await fetchData()
    }
  } catch (e) {
    console.error('Error deleting comment', e)
  }
}
onMounted(async () => {
  await new Promise<void>((resolve) => {
    onAuthStateChanged(getAuth(), (user) => {
      uid.value = user ? user.uid : ''
      resolve()
    })
  })
  await fetchData()
})
</script>
<template>
  <div class="comment-form bg-gray-900 h-screen flex flex-col">
    <h2 class="text-white"></h2>
    <div class="md:flex md:items-center mb-6 text-white">投稿一覧</div>
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="item in result"
          class="bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-xl font-bold text-white">選手名: {{ item.favName }}</h3>
              <p class="text-gray-400">投稿者: {{ item.fullName }}</p>
            </div>
            <div class="text-gray-400">
              {{ item.createdAt }}
            </div>
          </div>
          <div class="text-white font-medium border-t border-gray-700 pt-4 flex justify-between">
            <p>{{ item.comment }}</p>
            <button
              @click="openModal(item)"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              削除する
            </button>
          </div>
          <DeleteModal
            :is-open="isModalOpen"
            :submitted-time="item.createdAt"
            :full-name="item.fullName"
            @close="onCloseDeleteModal"
            @delete="deletePost"
          ></DeleteModal>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button
        type="button"
        class="text-white bg-gray border-2 border-gray-400 rounded"
        @click="goList"
      >
        次へ
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
