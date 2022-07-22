<template>
  <div>
    <div class="desktop-profile-sidebar">
      <div class="profile-sidebar">
        <div class="title">Social media</div>

        <div v-for="item in SOCIAL_MOCK" :key="item.name" class="list">
          <div class="list-title">{{ item.title.toLowerCase() }}</div>
          <ul>
            <li v-for="link in item.links" :key="link.name" class="li">
              <AccountCard :icon="item.title.toLowerCase()" :account="link.name" :tag-list="link.tags" link="/" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mobile-profile-sidebar">
      <AppExpandMenu>
        <template #header>Social media</template>
        <template #default>
          <div class="profile-sidebar">
            <div v-for="item in SOCIAL_MOCK" :key="item.name" class="list">
              <div class="list-title">{{ item.title.toLowerCase() }}</div>
              <ul>
                <li v-for="link in item.links" :key="link.name" class="li">
                  <AccountCard :icon="item.title.toLowerCase()" :account="link.name" :tag-list="link.tags" link="/" />
                </li>
              </ul>
            </div>
          </div>
        </template>
      </AppExpandMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import AccountCard from '@/components/cards/AccountCard.vue'

const SOCIAL_MOCK = [
  {
    title: 'INSTAGRAM',
    links: [
      {
        name: 'myaccssdf',
        tags: ['tag1', 'tag2'],
      },
      {
        name: 'myacc2',
        tags: ['tag1', 'tag2'],
      },
    ],
  },
  {
    title: 'TWITCH',
    links: [
      {
        name: 'myacc',
        tags: ['tag1', 'tag2'],
      },
      {
        name: 'myacc2',
        tags: ['tag1', 'tag2'],
      },
    ],
  },
  {
    title: 'YOUTUBE',
    links: [
      {
        name: 'myacc',
        tags: ['tag1', 'tag2'],
      },
    ],
  },
]

export default defineComponent({
  name: 'ProfileSidebar',
  components: {
    AccountCard,
    AppExpandMenu,
  },
  setup() {
    return {
      SOCIAL_MOCK,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/profile/ProfileSidebar';
</style>
