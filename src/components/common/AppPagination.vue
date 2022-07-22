<template>
  <div class="pagination">
    <button class="button left" :disabled="activePage === 1" @click="changePage('prev')">
      <AppIcon name="dropdown" :color="activePage === 1 ? variables.cGrey100 : variables.cPrimary500" />
    </button>

    <template v-for="page in pages" :key="page">
      <button
        v-if="checkIfButtonShouldShow(activePage, page)"
        class="button middle"
        :class="{ '--active': activePage === page }"
        :disabled="disabled"
        @click="changePage(page)"
      >
        {{ getButtonTextToDisplay(activePage, page) }}
      </button>
    </template>

    <button class="button right" :disabled="isLastPage" @click="changePage('next')">
      <AppIcon name="dropdown" :color="isLastPage ? variables.cGrey100 : variables.cPrimary500" />
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppIcon from './AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'AppPagination',
  components: {
    AppIcon,
  },
  props: {
    count: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    activePage: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const pages = computed(() => Math.ceil(props.count / props.perPage))
    const isLastPage = computed(() => pages.value === props.activePage)

    const changePage = (page: number | 'prev' | 'next') => {
      let pageToEmit: number

      if (typeof page === 'number') pageToEmit = page
      else pageToEmit = page === 'prev' ? props.activePage - 1 : props.activePage + 1

      emit('page-change', pageToEmit)
    }

    const checkIfButtonShouldShow = (activePage: number, page: number) => {
      return (
        page === 1 ||
        pages.value <= 7 ||
        (activePage < 5 && page <= 6) ||
        (activePage >= 5 && activePage - 2 <= page && activePage + 2 >= page) ||
        (pages.value - 5 <= page && activePage >= pages.value - 3) ||
        pages.value === page
      )
    }

    const getButtonTextToDisplay = (activePage: number, page: number) => {
      if (
        pages.value > 7 &&
        ((activePage >= 5 && activePage - 2 === page && page <= pages.value - 5) ||
          (activePage === pages.value - 2 && page === activePage - 3) ||
          (activePage === pages.value - 1 && page === activePage - 4) ||
          (activePage === pages.value && page === activePage - 5) ||
          (page === 6 && (activePage === 1 || activePage === 2 || activePage === 3)) ||
          (activePage >= 4 && activePage + 2 === page && pages.value - 2 >= page))
      )
        return '...'

      return page
    }

    return {
      variables,
      pages,
      isLastPage,
      changePage,
      checkIfButtonShouldShow,
      getButtonTextToDisplay,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppPagination';
</style>
