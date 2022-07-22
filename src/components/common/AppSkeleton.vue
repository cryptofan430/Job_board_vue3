<template>
  <div ref="skeleton" class="skeleton">
    <div class="column column--1" :class="{ 'column--full': isSmall }">
      <div class="row row--1">
        <div class="line line--1"></div>
        <div class="line line--2"></div>
      </div>

      <div class="row row--2">
        <div class="line line--1"></div>
      </div>

      <div class="row row--3">
        <div class="line line--1"></div>
      </div>

      <div class="row row--4">
        <div class="line line--1"></div>
      </div>

      <div class="row row--5">
        <div class="line line--1"></div>
        <div class="line line--2"></div>
      </div>
    </div>

    <div v-if="!isSmall" class="column column--2">
      <div class="row row--1">
        <div class="line line--1"></div>
        <div class="line line--2"></div>
      </div>

      <div class="row row--2">
        <div class="line line--1"></div>
        <div class="line line--2"></div>
      </div>

      <div class="row row--3">
        <div class="line line--1"></div>
        <div class="line line--2"></div>
      </div>

      <div class="row row--4">
        <div class="line line--1"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'AppSkeleton',
  setup() {
    const skeleton = ref<HTMLDivElement | null>(null)
    const isSmall = ref(false)

    const checkIfElementIsSmall = function () {
      const parentWidth = skeleton.value?.parentElement?.clientWidth || 0
      isSmall.value = !!(parentWidth && parentWidth <= 500)
    }

    onMounted(() => {
      checkIfElementIsSmall()
      window.addEventListener('resize', checkIfElementIsSmall)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkIfElementIsSmall)
    })

    return {
      skeleton,
      isSmall,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppSkeleton';
</style>
