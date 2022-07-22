<template>
  <div class="popup">
    <div class="popup-content">
      <AppCloseButton @click="onClose" />

      <div class="avatar-container">
        <div class="circle">
          <img ref="imgElement" class="avatar" :src="imgUrl" alt="avatar" />
        </div>
      </div>

      <AppButton>Save</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
// import ImageCropper from 'cropperjs'

export default defineComponent({
  name: 'PopupAddPhoto',
  components: {
    AppCloseButton,
    AppButton,
  },
  props: {
    imgUrl: {
      type: String,
      required: false,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    const imgElement = ref<HTMLImageElement | null>(null)

    // const initCropper = () => {
    //   const img = imgElement.value
    //   if (!img) return

    //   const cropper = new ImageCropper(img, {
    //     checkCrossOrigin: true,
    //     aspectRatio: 1 / 1,
    //     crop(event) {
    //       console.log(event.detail.x)
    //       console.log(event.detail.y)
    //       console.log(event.detail.width)
    //       console.log(event.detail.height)
    //       console.log(event.detail.rotate)
    //       console.log(event.detail.scaleX)
    //       console.log(event.detail.scaleY)
    //     },
    //   })
    // }

    onMounted(() => {
      // initCropper()
    })

    const onClose = () => {
      emit('close')
    }

    return { imgElement, onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupAddPhoto';
</style>
