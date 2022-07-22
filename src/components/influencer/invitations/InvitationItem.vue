<template>
  <li class="invitation">
    <router-link :to="`/i/tasks/${invitation.task.id || ''}/propose`">
      <p class="name">
        {{ invitation.task?.title }}
      </p>
    </router-link>

    <div class="box">
      <SocialIcon :social-media-platform="invitation.platform" />

      <p class="account">@{{ invitation.socialAccountUsername }}</p>
    </div>
    <p class="created">
      {{ formattedDateAdded }}
    </p>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { InvitationSentToMe } from '@/types/invitation.model'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import SocialIcon from '@/components/common/AppSocialIcon.vue'

export default defineComponent({
  name: 'InvitationItem',
  components: {
    SocialIcon,
  },
  props: {
    invitation: {
      type: Object as PropType<InvitationSentToMe>,
      required: true,
    },
  },
  setup(props) {
    const formattedDateAdded = computed(() => getFormattedRelativeDate(props.invitation.date))

    return { formattedDateAdded }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/invitations/InvitationItem';
</style>
