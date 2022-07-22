<template>
  <div class="toasts">
    <transition-group tag="ul" class="toasts-list" name="list" mode="in-out">
      <AppToast v-for="toast in getToastsList" :key="toast.id" :toast-type="toast.type" @click="toast.remove">
        {{ toast.content }}
      </AppToast>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppToast from '@/components/common/AppToast.vue'
import useToastsStore from '@/store/toasts'

export default defineComponent({
  components: {
    AppToast,
  },
  setup() {
    const { getToastsList } = useToastsStore()

    return {
      getToastsList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppToasts';
</style>
