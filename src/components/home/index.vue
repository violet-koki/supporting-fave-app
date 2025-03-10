<!-- HomeScreen.vue -->
<template>
  <div class="max-w-4xl mx-auto p-4 bg-gray-900">
    <!-- ヘッダー部分 -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-white">推しジャン</h1>
      <h3 class="text-xl mb-2 text-white">推し麻雀プロにコメントして応援しよう</h3>
      <div class="flex items-center space-x-2">
        <bell-icon class="w-5 h-5" />
        <span class="text-sm text-white">3件の新着通知があります</span>
      </div>
    </header>

    <!-- メイン機能へのクイックアクセス -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button v-for="button in mainButtons" :key="button.id" class="flex items-center justify-center p-4 rounded-lg"
        :class="button.bgColor" @click="goNext(button.page)">
        <component :is="button.icon" class="w-6 h-6 mr-2" />
        <span>{{ button.label }}</span>
      </button>
    </div>
    <div>
      <button class="flex items-center justify-center p-4 rounded-lg bg-blue-100" @click="login">
        サインアップ
      </button>
    </div>

    <!-- 注目の対局予定 -->
    <section class="mb-6">
      <h2 class="text-xl font-bold mb-3 mt-3 text-white">今日の注目対局</h2>
      <div class="space-y-3">
        <div v-for="match in upcomingMatches" :key="match.id" class="p-3 bg-gray-50 rounded-lg">
          <div class="font-medium">{{ match.player }}</div>
          <div class="text-sm text-gray-600">{{ match.event }} - {{ match.date }}</div>
        </div>
      </div>
    </section>

    <!-- ニュースフィード -->
    <section>
      <h2 class="text-xl font-bold mb-3 text-white">最新ニュース</h2>
      <div class="space-y-3">
        <div v-for="item in news" :key="item.id" class="p-3 border-b">
          <div class="font-medium text-white">{{ item.title }}</div>
          <div class="text-sm text-gray-600 text-white">{{ item.date }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Bell, Calendar, Star, Trophy, Users, Video } from 'lucide-vue-next'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'vue-router'

interface Match {
  id: number
  player: string
  event: string
  date: string
}

interface NewsItem {
  id: number
  title: string
  date: string
}

interface MainButton {
  id: number
  label: string
  icon: any // lucide-vueのコンポーネント型
  bgColor: string
  page: string
}

const router = useRouter()
const upcomingMatches: Match[] = [
  { id: 1, player: '堀慎吾', event: 'Mリーグ', date: '2025/1/9 19:00' },
  { id: 2, player: '佐々木寿人', event: '天鳳名人戦', date: '2025/1/10 20:00' },
]

const news: NewsItem[] = [
  { id: 1, title: '堀慎吾が連続トップ！驚異の4連勝', date: '2025/1/8' },
  { id: 2, title: '佐々木寿人、天鳳名人戦で快進撃', date: '2025/1/7' },
]

const login = () => {
  signInWithPopup(getAuth(), new GoogleAuthProvider())
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential) {
        const token = credential.accessToken
      }
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    })
}
const goNext = (page: string) => {
  router.push({ name: page })
}

const mainButtons: MainButton[] = [
  {
    id: 1,
    label: '推し日記を投稿',
    icon: Star,
    bgColor: 'bg-red-500',
    page: 'register',
  },
  {
    id: 2,
    label: '対局予定',
    icon: Calendar,
    bgColor: 'bg-blue-600',
    page: 'gameSchedule',
  },
  {
    id: 3,
    label: 'YouTube一覧',
    icon: Video,
    bgColor: 'bg-yellow-600',
    page: 'rank',
  },
  {
    id: 4,
    label: 'ファン広場',
    icon: Users,
    bgColor: 'bg-purple-600',
    page: 'communitySquare',
  },
]
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
