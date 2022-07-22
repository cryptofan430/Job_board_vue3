<template>
  <div class="expand-wrapper">
    <div class="header" @click="handleExpand">
      <span class="header-title" :class="headerTitleClasses">{{ currentTab?.title }}</span>
      <button type="button" class="expand-button" :class="buttonClasses">
        <AppIcon class="expand-menu-icon" color="currentColor" name="dropdown"></AppIcon>
      </button>
    </div>

    <div class="content-wrapper" :style="{ height: autoHeight || contentHeight }" @transitionend="applyAutoHeight">
      <div ref="contentEl" class="content">
        <router-link v-for="value in values" :key="value.slug || value.title" class="link" :to="value.url">{{
          value.title
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

interface DropdownValue {
  title: string
  slug?: string
  url: string
}

export default defineComponent({
  components: {
    AppIcon,
  },
  props: {
    values: {
      type: Array as PropType<Array<DropdownValue>>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const isExpanded = ref(false)
    const contentEl = ref<HTMLElement | null>()
    const contentHeight = ref<string | null>()
    const autoHeight = ref<string | null>(null)

    const currentPath = ref(router.currentRoute.value.path)

    const buttonClasses = computed(() => {
      const expandClasses = isExpanded.value ? '--expanded' : '--content-hidden'

      return `${expandClasses}`
    })

    const headerTitleClasses = computed(() => {
      const expandClasses = isExpanded.value ? 'expanded-header-title' : ''

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

    const currentTab = computed(() => {
      return props.values.find((item) => item.url === currentPath.value)
    })

    watch(router.currentRoute, () => {
      currentPath.value = router.currentRoute.value.path
      isExpanded.value = false
      autoHeight.value = null
      setTimeout(() => {
        contentHeight.value = null
      })
    })

    return {
      isExpanded,
      contentEl,
      contentHeight,
      autoHeight,
      buttonClasses,
      headerTitleClasses,
      currentTab,
      handleExpand,
      applyAutoHeight,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppNavigation';
</style>
