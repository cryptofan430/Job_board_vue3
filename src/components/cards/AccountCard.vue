<template>
  <div class="account-card" :class="size">
    <div class="account-info-container">
      <div class="main-info">
        <AppIcon :name="icon" :size="iconSize" />

        <div class="account-info">
          <router-link class="name" :to="link">@{{ account }}</router-link>

          <div v-if="size !== 'sm' && tagList" class="tag-list">
            <template v-for="(tag, i) in tagList" :key="i">
              <AppTag v-if="tag.length" sm>{{ tag }}</AppTag>
            </template>
          </div>
        </div>
      </div>

      <div v-if="isUnavailable" class="unavailable-account">
        <AppIcon name="warning" :size="iconSize" color="#FF5035" />
        <span class="text">Account unavailable for {{ timeEllapsed.time }} {{ timeEllapsed.unit }} </span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import AppIcon, { IconName } from '@/components/common/AppIcon.vue'
import AppTag from '@/components/common/AppTag.vue'
import { getTimeEllapsedFromNow } from '@/components/helpers/timeFormatter'

export default defineComponent({
  name: 'AccountCard',
  components: {
    AppIcon,
    AppTag,
  },
  props: {
    size: {
      type: String as PropType<'sm' | 'md'>,
      default: 'md',
    },
    account: {
      type: String,
      required: true,
    },
    icon: {
      type: String as PropType<IconName>,
      required: true,
    },
    tagList: {
      type: Array as PropType<Array<string>>,
      required: false,
    },
    link: {
      type: String,
      required: true,
    },
    proposalDate: {
      type: String,
      default: String(Date.now()),
    },
  },
  setup(props) {
    const iconSize = computed(() => {
      if (props.size === 'md') return 'lg'
      return 'md'
    })

    const timeEllapsed = ref(getTimeEllapsedFromNow(props.proposalDate))
    const isUnavailable = computed(() => timeEllapsed.value.time > 0)

    return { iconSize, timeEllapsed, isUnavailable }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/cards/AccountCard';
</style>
