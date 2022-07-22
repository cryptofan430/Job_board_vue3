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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReferenceItem from '@/components/marketer/profile/ReferenceItem.vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'

const REFERENCES_MOCK = [
  {
    author: `Influencer's name 1`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 4,
  },
  {
    author: `Influencer's name 2`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. `,
    rating: 3,
  },
  {
    author: `Influencer's name 3`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus.`,
    rating: 5,
  },
  {
    author: `Influencer's name 4`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula, diam sit amet scelerisque euismod, metus quam tincidunt mi, in fermentum leo nisl eget metus. Duis blandit facilisis eros id pharetra. Sed mauris nisl, eleifend eget elit id, convallis imperdiet massa.`,
    rating: 1,
  },
]

export default defineComponent({
  name: 'ProfileReferences',
  components: {
    ReferenceItem,
    AppExpandMenu,
  },
  setup() {
    return { REFERENCES_MOCK }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/profile/ProfileReferences';
</style>
