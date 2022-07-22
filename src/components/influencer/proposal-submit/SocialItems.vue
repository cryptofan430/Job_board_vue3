<template>
  <div>
    <p class="social-title">Choose relevant social media accounts:</p>

    <div v-if="noRelevantAccounts" div class="no-social-info">
      <p class="no-social-content">No social media accounts linked yet.</p>

      <router-link to="/settings/social-media" class="no-social-link"> Add social media account now </router-link>
    </div>

    <div v-else-if="selectedRelevantAccounts && relevantAccounts">
      <div v-for="(socials, type) in relevantAccounts" :key="type">
        <div v-for="social in socials" :key="social.id" class="social-item">
          <AppCheckbox
            :id="social.id"
            v-model="selectedRelevantAccounts[type.toUpperCase()]"
            :value="social.id"
            :disabled="checkAccount(social.enabledForProposalsDate)"
          />

          <AppLabel class="social-box" :for="social.id">
            <div class="main-social-info">
              <AppIcon :name="type" size="md" :color="variables.cPrimary500" />

              <router-link :to="`/insights/${type}/${social.id}`" class="social-name">
                {{ social.username }}
              </router-link>
            </div>

            <div v-if="checkAccount(social.enabledForProposalsDate)" class="unavailable-account">
              <AppIcon name="warning" size="sm" color="#FF5035" />
              <span class="text"> Account unavailable for {{ getTime(social.enabledForProposalsDate) }} </span>
            </div>
          </AppLabel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, Ref } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import { getTimeEllapsedFromNow } from '@/components/helpers/timeFormatter'
import { AccountIdsGroupedByPlatform, SocialMediaAccountsResponse } from '@/types/platform.model'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'SocialItems',
  components: {
    AppIcon,
    AppCheckbox,
    AppLabel,
  },
  props: {
    relevantAccounts: {
      type: Object as PropType<SocialMediaAccountsResponse>,
      required: false,
    },
    noRelevantAccounts: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    console.log(props.relevantAccounts)
    const selectedRelevantAccounts = inject<Ref<AccountIdsGroupedByPlatform>>(
      'selected-relevant-accounts'
    ) as Ref<AccountIdsGroupedByPlatform>

    const getTime = (date: string) => {
      const ellapsedTimeObj = getTimeEllapsedFromNow(date)

      return ellapsedTimeObj.time + ' ' + ellapsedTimeObj.unit
    }

    const checkAccount = (date: string) => {
      const ellapsedTimeObj = getTimeEllapsedFromNow(date)
      if (ellapsedTimeObj.time > 0) {
        return true
      }

      return false
    }

    return {
      selectedRelevantAccounts,
      variables,
      getTime,
      checkAccount,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal-submit/SocialItems';
</style>
