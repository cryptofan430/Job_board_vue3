<template>
  <div class="wrapper">
    <p v-if="title" class="title">{{ title }}</p>

    <AppSkeleton v-if="isLoading" />

    <AppErrorBox v-else-if="isError" @clicked="reloadItems">{{ entitiesName }}</AppErrorBox>

    <ul v-else-if="isLoaded && items.length" class="list">
      <li v-for="(item, index) in items" :key="`${item.name}__${index}`" class="item">
        <router-link :to="item.link" class="sidebar-item-link">
          <span class="item-name">{{ item.name }}</span>

          <span class="item-date">{{ item.date }}</span>
        </router-link>
      </li>
    </ul>

    <p v-else class="no-items">
      <slot name="noItemsText">No data</slot>
    </p>

    <router-link v-if="items.length && isLoaded" :to="routePath">
      <AppButton v-if="items.length" outlined>Show all</AppButton>
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ApiLoadingState } from '@/types/api.model'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'

interface SidebarItem {
  name: string
  date: string
  link: string
}

export default defineComponent({
  name: 'SidebarList',
  components: {
    AppButton,
    AppSkeleton,
    AppErrorBox,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    state: {
      type: String as PropType<ApiLoadingState>,
      required: false,
    },
    items: {
      type: Array as PropType<Array<SidebarItem>>,
      default: () => [],
    },
    routePath: {
      type: String,
      required: true,
    },
    entitiesName: {
      type: String,
      required: true,
    },
  },
  emits: ['reload-items'],
  setup(props, { emit }) {
    const isLoading = computed(() => props.state === 'loading')
    const isLoaded = computed(() => props.state === 'loaded')
    const isError = computed(() => props.state === 'error')

    const reloadItems = () => emit('reload-items')

    return {
      isLoading,
      isLoaded,
      isError,
      reloadItems,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks/SidebarList.scss';
</style>
