<template>
  <div class="popup">
    <div class="popup-content">
      <AppCloseButton @click="onClose" />

      <h3 class="popup-title">{{ errorText }}</h3>

      <p v-if="redirectUrl" class="additional-info">You will be redirected</p>

      <AppButton @click="onClose">Got it</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppRequestErrorPopup',
  components: {
    AppCloseButton,
    AppButton,
  },
  props: {
    redirectUrl: {
      type: String,
      required: false,
    },
    errorText: {
      type: String,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()

    const onClose = () => {
      if (!props.redirectUrl) {
        emit('close')
        return
      }

      router.push(props.redirectUrl)
    }

    return { onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppRequestErrorPopup';
</style>
