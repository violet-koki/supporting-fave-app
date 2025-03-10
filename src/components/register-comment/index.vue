<template>
  <div class="comment-form bg-gray-900">
    <h2 class="text-white">新規コメント投稿</h2>
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <label
          for="image"
          class="text-white"
        >
          画像
        </label>
        <input
          id="image"
          type="file"
          class="rounded border-2 border-gray-400"
          @change="
            (e: Event) => {
              const target = e.target as HTMLInputElement
              imageFile = target.files ? target.files[0] : null
            }
          "
        />
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-last-name"
          >
            投稿者名
            <text class="text-white bg-red-500 font-normal text-sm ml-2 p-0.5 rounded-md">
              必須
            </text>
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            defaultValue=""
            placeholder="姓"
            v-model="formData.fullName"
          />
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="inline-last-name"
          >
            選手名
            <text class="text-white bg-red-500 font-normal text-sm ml-2 p-0.5 rounded-md">
              必須
            </text>
          </label>
        </div>
        <div class="md:w-2/3">
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
            <select id="countries" v-model="formData.favName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected>選択してください</option>
              <option v-for="option in favOptions" :key="option.value">{{  option.text }}</option>
            </select>
        </div>
      </div>

      <div class="form-group">
        <label
          for="comment"
          class="block text-white font-bold md:text-left mb-1 md:mb-0 pr-4"
          htmlFor="inline-last-name"
        >
          コメント
        </label>
        <textarea
          id="comment"
          class="rounded border-2 border-gray-400"
          v-model="formData.comment"
          rows="4"
          required
        ></textarea>
      </div>

      <!-- プレビュー表示 -->
      <div
        v-if="showPreview"
        class="preview font-bold"
      >
        <h3>プレビュー</h3>
        <p class="rounded">名前: {{ formData.fullName }}</p>
        <p class="rounded">選手名: {{ formData.favName }}</p>
        <p class="rounded">コメント: {{ formData.comment }}</p>
      </div>

      <div class="buttons">
        <button
          type="button"
          class="text-white bg-gray border-2 border-gray-400 rounded"
          @click="togglePreview"
        >
          {{ showPreview ? 'プレビューを隠す' : 'プレビューを表示' }}
        </button>
        <button
          type="submit"
          class="text-white bg-gray border-2 border-gray-400 rounded"
        >
          投稿する
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { db } from '@/firebase/index.ts'
import { favOptions } from '@/util/selector/selectFav'

// フォームデータの状態管理
const formData = reactive({
  fullName: '',
  favName: '',
  comment: '',
})
const imageFile = ref<File | null>(null)
const router = useRouter()
const uid = ref('')

// プレビュー表示の状態管理
const showPreview = ref(false)

// プレビューの切り替え
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// フォーム送信処理
const submitComment = async () => {
  // ここにバリデーションや送信処理を追加
  // console.log('送信されたデータ:', formData)
  let imageUrl = null

  if (imageFile.value) {
    const storage = getStorage()
    const storageReference = storageRef(storage, `posts/${Date.now()}_${imageFile.value.name}`)
    await uploadBytes(storageReference, imageFile.value)
    imageUrl = await getDownloadURL(storageReference)
  }
  const user = getAuth().currentUser
  if (user) {
    const uid = user ? user.uid : ''
  }
  await addDoc(collection(db, 'posts'), {
    comment: formData.comment,
    fullName: formData.fullName,
    favName: formData.favName,
    createdAt: new Date(),
    userId: uid.value,
  })
    .then(() => {
      return router.push({ name: 'registerComplete' })
    })
    .catch()
    .finally()
  //Todo あとでエラーハンドリング実装

  formData.fullName = ''
  formData.favName = ''
  formData.comment = ''
  imageFile.value = null
  showPreview.value = false
}

onMounted(async () => {
  await new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      uid.value = user ? user.uid : ''
      resolve()
    })
  })
})
</script>

<style scoped>
.comment-form {
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
}

.preview {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
}

@media (min-width: 1024px) {
  .form-group {
    margin-bottom: 20px;
    /* より大きな余白 */
  }

  input,
  textarea {
    padding: 12px;
    /* より大きな入力エリア */
    font-size: 1.1rem;
    width: 100%;
    /* より大きなフォント */
  }

  .preview {
    margin: 30px 0;
    padding: 20px;
  }

  .buttons {
    gap: 15px;
    /* ボタン間の余白を増やす */
    margin-top: 30px;
  }

  button {
    padding: 12px 24px;
    font-size: 1.1rem;
  }
}
</style>
