<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface ChannelStatistics {
  id: string
  title: string
  subscriberCount: string
  viewCount: string
  videoCount: string
  description: string
  thumbnails: {
    default: { url: string }
  }
}

// プロ雀士のチャンネルID
const channels = ref([
  'UCZyvKmQRDoj8phel00S94EA',
  'UCt40tSdNIum1EzOyy-_K2HA',
  'UCihYMokYrglpPKgjzbZYgqA',
])

const channelStats = ref<ChannelStatistics[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

const fetchChannelStatistics = async () => {
  loading.value = true
  error.value = null

  try {
    const stats = await Promise.all(
      channels.value.map(async (channelId) => {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'statistics,snippet',
            id: channelId,
            key: apiKey,
          },
        })

        const channel = response.data.items[0]
        return {
          id: channelId,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          subscriberCount: channel.statistics.subscriberCount,
          viewCount: channel.statistics.viewCount,
          videoCount: channel.statistics.videoCount,
        }
      }),
    )

    channelStats.value = stats.sort(
      (a, b) => parseInt(b.subscriberCount) - parseInt(a.subscriberCount),
    )
  } catch (err) {
    error.value = `統計情報の取得に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChannelStatistics()
})
</script>

<template>
  <div class="channel-stats">
    <h1 class="main-title">プロ雀士 YouTubeチャンネル統計</h1>

    <div
      v-if="loading"
      class="loading"
    >
      <div class="loading-spinner"></div>
      データを読み込み中...
    </div>

    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>

    <div
      v-if="!loading && !error"
      class="stats-list"
    >
      <div
        v-for="channel in channelStats"
        :key="channel.id"
        class="channel-item"
      >
        <div class="channel-header">
          <img
            v-if="channel.thumbnails?.default?.url"
            :src="channel.thumbnails.default.url"
            :alt="channel.title"
            class="channel-avatar"
          />
          <h2 class="channel-title">{{ channel.title }}</h2>
        </div>

        <div class="channel-stats-grid">
          <div class="stat-item">
            <span class="stat-label">登録者数</span>
            <span class="stat-value">{{ parseInt(channel.subscriberCount).toLocaleString() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">総視聴回数</span>
            <span class="stat-value">{{ parseInt(channel.viewCount).toLocaleString() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">動画数</span>
            <span class="stat-value">{{ channel.videoCount }}</span>
          </div>
        </div>

        <div class="channel-description">
          {{ channel.description?.slice(0, 150)
          }}{{ channel.description?.length > 150 ? '...' : '' }}
        </div>

        <a
          :href="`https://www.youtube.com/channel/${channel.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="channel-link"
        >
          チャンネルを見る
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.channel-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-title {
  font-size: 2rem;
  color: #ff69b4;
  text-align: center;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #ff4444;
  padding: 1rem;
  border: 1px solid #ff4444;
  border-radius: 4px;
  margin: 1rem 0;
}

.stats-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.channel-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.channel-item:hover {
  transform: translateY(-4px);
}

.channel-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.channel-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
}

.channel-title {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.channel-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: bold;
  color: #ff69b4;
}

.channel-description {
  font-size: 0.875rem;
  color: #666;
  margin: 1rem 0;
  line-height: 1.5;
}

.channel-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #ff69b4;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.channel-link:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .stats-list {
    grid-template-columns: 1fr;
  }

  .channel-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
