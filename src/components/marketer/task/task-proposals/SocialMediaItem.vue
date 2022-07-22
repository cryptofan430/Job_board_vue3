<template>
  <div class="table-row">
    <p class="table-cell account-cell">
      <span class="social-media-name">{{ platformName }}</span>
      <router-link class="account-tag" :to="link">@{{ userName }}</router-link>
    </p>
    <p class="table-cell">100K</p>
    <p class="table-cell">
      <template v-if="rating || rating === 0">{{ rating }}/5</template>
      <template v-else>-</template>
    </p>
    <p class="table-cell">${{ moneyEarned || 0 }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    platformName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    userName: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    moneyEarned: {
      type: Number,
      required: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-proposals/SocialMediaItem';
</style>
