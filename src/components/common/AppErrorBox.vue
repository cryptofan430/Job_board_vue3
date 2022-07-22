<template>
  <div class="error-box">
    <span class="error-box-content">
      Loading
      <span>
        <slot></slot>
      </span>
      failed
    </span>

    <AppButton size="sm" @click="handleClick">Reload</AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppButton from './AppButton.vue'

export default defineComponent({
  name: 'AppErrorBox',
  components: { AppButton },
  emits: ['clicked'],
  setup(_, { emit }) {
    const handleClick = () => {
      emit('clicked')
    }

    return { handleClick }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppErrorBox';
</style>
