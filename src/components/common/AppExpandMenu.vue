<template>
  <div class="expand-wrapper">
    <div class="header" :class="headerColor" @click="handleExpand">
      <slot name="header"></slot>
      <button type="button" class="expand-button" :class="buttonClasses">
        <AppIcon class="expand-menu-icon" color="currentColor" name="dropdown"></AppIcon>
      </button>
    </div>

    <div class="content-wrapper" :style="{ height: autoHeight || contentHeight }" @transitionend="applyAutoHeight">
      <div ref="contentEl" class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'

export default defineComponent({
  components: {
    AppIcon,
  },
  props: {
    headerColor: {
      type: String,
      default: 'primary-header-color',
    },
  },
  setup() {
    const isExpanded = ref(false)
    const contentEl = ref<HTMLElement | null>()
    const contentHeight = ref<string | null>()
    const autoHeight = ref<string | null>(null)

    const buttonClasses = computed(() => {
      const expandClasses = isExpanded.value ? '--expanded' : '--content-hidden'

      return `${expandClasses}`
    })

    const handleExpand = () => {
      if (isExpanded.value) {
        isExpanded.value = false
        autoHeight.value = null
        setTimeout(() => {
          contentHeight.value = null
        })
      } else if (contentEl.value) {
        isExpanded.value = true
        contentHeight.value = contentEl.value.offsetHeight + 'px'
      }
    }
    const applyAutoHeight = () => {
      if (isExpanded.value) {
        autoHeight.value = 'auto'
      }
    }

    return {
      isExpanded,
      contentEl,
      contentHeight,
      autoHeight,
      buttonClasses,
      handleExpand,
      applyAutoHeight,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppExpandMenu';
</style>
