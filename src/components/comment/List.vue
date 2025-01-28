<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { collection, doc, DocumentSnapshot, getDoc, query, where, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from '@/firebase/index.ts'
import { onMounted, ref, onUnmounted } from 'vue'
import type { Post } from '@/types/post.d'

const router = useRouter()
const userRef = collection(db, 'posts')
const uid = ref('')
const unsubscribe = ref()
const items = ref('')
const result = ref<Post[]>([])
const fetchData = async () => {
  // Todo エラーハンドリングの実装
  // if (!getAuth().currentUser) {
  //     console.log('User not found')
  //     return
  // }
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
        favName: doc.data().favName,
        fullName: doc.data().fullName,
        createdAt: createdAt,
        comment: doc.data().comment,
      })
    })
  }
}
const goList = () => {
  router.push({ name: 'commentList' })
}
onMounted(async () => {
  await new Promise<void>((resolve) => {
    onAuthStateChanged(getAuth(), (user) => {
      resolve()
    })
  })
  await fetchData()
})
</script>
<template>
  <div class="comment-form bg-black">
    <h2 class="text-white"></h2>
    <div class="md:flex md:items-center mb-6 text-white">投稿一覧</div>
    <div class="grid grid-cols-1 gap-6">
      <div v-for="item in result" class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-xl font-bold text-white">選手名: {{ item.favName }}</h3>
            <p class="text-gray-400">投稿者: {{ item.fullName }}</p>
          </div>
          <div class="text-gray-400">
            {{ item.createdAt }}
          </div>
        </div>
        <div class="text-white font-medium border-t border-gray-700 pt-4">
          {{ item.comment }}
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
