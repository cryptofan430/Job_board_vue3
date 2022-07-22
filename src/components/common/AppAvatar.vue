<template>
  <div class="avatar" :class="classList">
    <img v-if="imgUrl && imgUrl.length" :src="imgUrl" class="avatar-img" />

    <ProfileIcon v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import ProfileIcon from './icons/ProfileIcon.vue'

type Status = 'online' | 'away'
type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export default defineComponent({
  name: 'AppAvatar',
  components: {
    ProfileIcon,
  },
  props: {
    imgUrl: {
      type: String,
      required: false,
    },
    size: {
      type: String as PropType<AvatarSize>,
      default: 'sm',
    },
    status: {
      type: String as PropType<Status>,
      required: false,
    },
  },
  setup(props) {
    const classList = computed(() => {
      const status = props.status ? `status --${props.status}` : ''
      const size = `--${props.size}`
      return `${status} ${size}`
    })

    return { classList }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppAvatar';
</style>
