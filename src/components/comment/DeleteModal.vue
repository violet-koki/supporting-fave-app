<script setup lang="ts">
type Props = {
  isOpen: boolean
  submittedTime: string
  fullName: string
}
type Emits = {
  (e: 'close'): void
  (e: 'delete'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const closeModal = () => {
  emit('close')
}
const deletePost = () => {
  emit('delete')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">削除の確認</h3>
      <p class="mb-4">このコメントを削除してもよろしいですか？</p>

      <div class="flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          キャンセル
        </button>
        <button
          @click="deletePost"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          削除する
        </button>
      </div>
    </div>
  </div>
</template>
