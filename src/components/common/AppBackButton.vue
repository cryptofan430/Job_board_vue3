<template>
  <div @click="handleBackButtonClick">
    <router-link :to="backRoute || returnURL" class="link">
      <AppIcon :color="variables.cPrimary900" name="back" />
      <span class="back-icon-text"> {{ buttonText || buttonName }} </span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watch, ref } from 'vue'
import { RouterLinkProps, useRouter } from 'vue-router'
import variables from '@/assets/variables'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'BlankHeader',
  components: {
    AppIcon,
  },
  props: {
    showBack: {
      type: Boolean,
      default: false,
    },
    showBackToLogin: {
      type: Boolean,
      default: false,
    },
    backRoute: {
      type: [String, Object] as PropType<RouterLinkProps['to']>,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter()
    const redirectPath = ref(router.options.history.state.back)
    const redirectToHomepage = ref(true)

    const buttonName = computed(() => {
      if (props.showBack) {
        return 'Back'
      }
      if (props.showBackToLogin) {
        return 'Back to login'
      }
      return null
    })

    const returnURL = computed(() => {
      if (props.showBack) {
        return redirectPath.value
      }
      if (props.showBackToLogin) {
        return '/login'
      }
      return '/'
    })

    const handleBackButtonClick = () => {
      if (redirectToHomepage.value && router.currentRoute.value.path !== redirectPath.value) {
        router.push('/')
      }
    }

    watch(router.currentRoute, () => {
      redirectPath.value = router.options.history.state.back
      redirectToHomepage.value = false
    })

    return {
      variables,
      returnURL,
      buttonName,
      handleBackButtonClick,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppBackButton.scss';
</style>
