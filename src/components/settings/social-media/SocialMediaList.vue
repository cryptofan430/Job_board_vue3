<template>
  <div class="social-container">
    <div class="header">
      <p class="title">{{ title }}</p>
      <AppButton v-if="isAddButtonVisible" @click="emitAddSocialAccount">Add account</AppButton>
    </div>

    <ul class="list">
      <slot></slot>
    </ul>
  </div>
  <div class="mobile-add-account-btn">
    <AppButton v-if="isAddButtonVisible" @click="emitAddSocialAccount"> {{ addAccountButtonLabel }} </AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'

export default defineComponent({
  name: 'SocialMediaList',
  components: { AppButton },
  props: {
    title: {
      type: String,
      required: true,
    },
    isAddButtonVisible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['add-social-account'],
  setup(props, { emit }) {
    const emitAddSocialAccount = () => {
      emit('add-social-account')
    }

    const addAccountButtonLabel = computed(() => {
      return 'Add new ' + props.title + ' account'
    })

    return { emitAddSocialAccount, addAccountButtonLabel }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/settings-social-media/SocialMediaList';
</style>
