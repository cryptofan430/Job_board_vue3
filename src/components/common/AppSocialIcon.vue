<template>
  <AppIcon v-if="iconName" :name="iconName" :color="variables.cPrimary500" size="md" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'
import { SocialMediaPlatform } from '@/types/platform.model'

export default defineComponent({
  components: {
    AppIcon,
  },
  props: {
    socialMediaPlatform: {
      type: String as PropType<SocialMediaPlatform>,
      required: true,
    },
  },
  setup(props) {
    const iconName = computed(() => {
      if (SocialMediaPlatform.TWITCH === props.socialMediaPlatform) {
        return 'twitch'
      }
      if (SocialMediaPlatform.YOUTUBE === props.socialMediaPlatform) {
        return 'youtube'
      }
      if (SocialMediaPlatform.INSTAGRAM === props.socialMediaPlatform) {
        return 'instagram'
      }
      return null
    })

    return {
      variables,
      iconName,
    }
  },
})
</script>
