<template>
  <div class="__input-decoration">
    <slot :classList="classList"></slot>

    <div v-if="$slots.leftIcon" class="__left-icon-wrapper">
      <slot name="leftIcon"></slot>
    </div>

    <div v-if="$slots.rightIcon" class="__right-icon-wrapper">
      <slot name="rightIcon"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    const classList = computed(() => {
      let IconClasses = ''

      if (slots.leftIcon) {
        IconClasses = '__left-icon-input'
      }

      if (slots.rightIcon) {
        IconClasses = '__right-icon-input'
      }

      const classList = `${IconClasses}`
      return classList
    })

    return { classList }
  },
})
</script>

<style lang="scss">
@import '@/assets/styles/components/common/AppInputDecoration';
</style>
