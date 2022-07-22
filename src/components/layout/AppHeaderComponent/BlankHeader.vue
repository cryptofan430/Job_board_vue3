<template>
  <header class="header-blank" :class="classList">
    <div v-if="showBackBtn || showBackTologinBtn" class="back-icon-container">
      <AppBackButton :show-back="showBackBtn" :show-back-to-login="showBackTologinBtn" />
    </div>
    <div class="logo-container">
      <router-link to="/">
        <AppIcon :color="variables.cPrimary900" name="logotype" />
      </router-link>
    </div>
    <div class="logo-sm-container">
      <router-link to="/">
        <AppIcon :color="variables.cPrimary900" name="logotype" size="sm" />
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import variables from '@/assets/variables'
import AppIcon from '../../common/AppIcon.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'

export default defineComponent({
  name: 'BlankHeader',
  components: {
    AppIcon,
    AppBackButton,
  },
  setup() {
    const router = useRouter()
    const showBackBtn = ref(false)
    const showBackTologinBtn = ref(false)

    showBackBtn.value = router.currentRoute.value.meta?.showBackButton as boolean
    showBackTologinBtn.value = router.currentRoute.value.meta?.showBackToLoginButton as boolean

    const classList = computed(() => {
      const marginHeader = showBackBtn.value || showBackTologinBtn.value ? `--margin-with-btn` : '--margin-with-no-btn'

      return `${marginHeader}`
    })

    watch(router.currentRoute, () => {
      showBackBtn.value = router.currentRoute.value.meta?.showBackButton as boolean
      showBackTologinBtn.value = router.currentRoute.value.meta?.showBackToLoginButton as boolean
    })

    return {
      variables,
      showBackBtn,
      showBackTologinBtn,
      classList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppHeaderComponent/BlankHeader';
</style>
