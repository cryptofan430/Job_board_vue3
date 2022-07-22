<template>
  <main class="select-account-type">
    <p class="message">Please, choose one of this options.</p>

    <AppButton class="marketer-button" @click="setMarketer">I am a marketer</AppButton>

    <AppButton class="influencer-button" outlined @click="setInfluencer">I am an influencer</AppButton>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import useAuthStore from '@/store/auth'

export default defineComponent({
  name: 'SelectAccountType',
  components: { AppButton },
  setup() {
    const router = useRouter()
    const { accountType } = useAuthStore()

    const setInfluencer = () => {
      accountType.value = 'influencer'
      router.push('/i/tasks/search')
    }
    const setMarketer = () => {
      accountType.value = 'marketer'
      router.push('/m/dashboard')
    }

    return {
      setInfluencer,
      setMarketer,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/SelectAccountType';
</style>
