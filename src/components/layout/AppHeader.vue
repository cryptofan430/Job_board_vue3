<template>
  <component :is="component" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import BlankHeader from './AppHeaderComponent/BlankHeader.vue'
import ContentHeader from './AppHeaderComponent/ContentHeader.vue'

export default defineComponent({
  name: 'AppHeader',
  components: {
    BlankHeader,
    ContentHeader,
  },
  setup() {
    const router = useRouter()

    const component = computed(() => {
      const headerPrefix = router.currentRoute.value.meta?.useBlankHeader ? 'Blank' : 'Content'

      return `${headerPrefix}Header`
    })

    return {
      component,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppHeader';
</style>
