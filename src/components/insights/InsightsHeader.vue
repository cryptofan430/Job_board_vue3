<template>
  <div class="insights-header">
    <div class="wrapper">
      <div class="profile">
        <AppIcon name="instagram" size="xl" />

        <div class="profile-details">
          <p class="name">Account’s name</p>

          <p class="username">@myacc</p>

          <div class="tags">
            <AppTag sm> tag1 </AppTag>

            <AppTag sm> tag1 </AppTag>

            <AppTag sm> tag1 </AppTag>
          </div>
        </div>
      </div>

      <div class="icon-row">
        <AppIcon name="rating" :color="variables.cPrimary500" />

        <p>5/5</p>
      </div>

      <div class="icon-row">
        <AppIcon name="money-earned" :color="variables.cPrimary500" />

        <p>$1000+</p>
      </div>
    </div>

    <div class="wrapper">
      <div class="overall">
        <AppIcon name="followers" :color="variables.cPrimary500" />

        <p class="overall-value">10K followers</p>
      </div>

      <p class="online">
        3 283 online
        <span class="online-status"></span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppTag from '@/components/common/AppTag.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'InsightsHeader',
  components: {
    AppIcon,
    AppTag,
  },
  setup() {
    return {
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/insights/InsightsHeader';
</style>
