<template>
  <div>
    <div class="desktop-profile-references">
      <div class="profile-references">
        <ReferenceItem v-for="reference in REFERENCES_MOCK" :key="reference.author" :reference="reference" />
      </div>
    </div>

    <div class="mobile-profile-references">
      <AppExpandMenu>
        <template #header>Reviews(39)</template>
        <template #default>
          <div class="profile-references">
            <ReferenceItem v-for="reference in REFERENCES_MOCK" :key="reference.author" :reference="reference" />
          </div>
        </template>
      </AppExpandMenu>
    </div>

    <AppPagination
      :per-page="PAGINATION_MOCKUP.referencesPerPage"
      :count="PAGINATION_MOCKUP.referencesCount"
      :active-page="PAGINATION_MOCKUP.activePage"
      :disabled="PAGINATION_MOCKUP.isLoading"
      @page-change="updatePage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReferenceItem from '@/components/influencer/profile/ReferenceItem.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'

const REFERENCES_MOCK = [
  {
    author: `Marketer's name 1`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 4,
  },
  {
    author: `Marketer's name 2`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. `,
    rating: 3,
  },
  {
    author: `Marketer's name 3`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus.`,
    rating: 5,
  },
  {
    author: `Marketer's name 4`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 1,
  },
  {
    author: `Marketer's name 5`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 2,
  },
  {
    author: `Marketer's name 6`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. `,
    rating: 4,
  },
  {
    author: `Marketer's name 7`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus.`,
    rating: 5,
  },
  {
    author: `Marketer's name 8`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 2,
  },
]

const PAGINATION_MOCKUP = {
  referencesCount: 24,
  activePage: 1,
  isLoading: false,
  referencesPerPage: 10,
}

export default defineComponent({
  name: 'ProfileReferences',
  components: {
    ReferenceItem,
    AppPagination,
    AppExpandMenu,
  },
  setup() {
    const updatePage = () => {
      console.log(PAGINATION_MOCKUP.activePage)
    }

    return {
      updatePage,
      REFERENCES_MOCK,
      PAGINATION_MOCKUP,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/profile/ProfileReferences';
</style>
