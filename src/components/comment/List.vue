<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { collection, doc, DocumentSnapshot, getDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { db } from '@/firebase/index.ts'
import { onMounted } from 'vue'

const router = useRouter()
const userRef = collection(db, 'posts')
const userId = getAuth().currentUser ? getAuth().currentUser.uid : '';
console.log(userId)
let result = []
const fetchData = async () => {
    const docRef = doc(db, 'posts', userId);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        result.push({
            id: docSnap.id,
            ...docSnap.data()
        })
    } else {
        throw new Error()
    }

}
const goList = () => {
    router.push({ 'name': 'commentList' })
}

onMounted(
    async () => {
        await fetchData()
    }
)
</script>
<template>
    <div class="comment-form bg-black">
        <h2 class="text-white"></h2>
        <div class="md:flex md:items-center mb-6 text-white">
            投稿一覧
        </div>
        <div class="grid grid-cols-1 gap-4">
            <div class="border border-blue-500 p-4">青い枠線</div>
            <div class="border border-blue-500 p-4">青い枠線</div>
            <div class="border border-blue-500 p-4">青い枠線</div>
            <div class="border border-blue-500 p-4">青い枠線</div>
            <div class="border border-blue-500 p-4">青い枠線</div>
            <div class="border border-blue-500 p-4">青い枠線</div>
        </div>
        <div class="buttons">
            <button type="button" class="text-white bg-gray border-2 border-gray-400 rounded" @click="goList">
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