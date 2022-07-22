<template>
  <div class="billing-card">
    <template v-if="side === 'front'">
      <div class="front-header">
        <div class="edit-icon">
          <AppIcon name="edit" :color="variables.cPrimary900" />
        </div>
      </div>

      <div class="footer">
        <div class="row">
          <span class="name">{{ name }}</span>
          <span class="expiration-date">{{ expirationDate }}</span>
        </div>

        <span class="number">{{ number }}</span>
      </div>
    </template>

    <template v-else>
      <div class="back-header">
        <AppIcon name="logotype" :color="variables.cPrimary900" size="sm" />
        <div class="edit-icon">
          <AppIcon name="edit" :color="variables.cPrimary900" />
        </div>
      </div>

      <div class="footer">
        <div class="row">
          <span class="name">{{ name }}</span>
        </div>

        <span class="money-available">
          <span class="money">${{ money }}</span>
          <span class="available-text"> available</span>
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import AppIcon from '@/components/common/AppIcon.vue'

type CardSide = 'front' | 'back'

export default defineComponent({
  name: 'BillingCard',
  components: { AppIcon },
  props: {
    side: {
      type: String as PropType<CardSide>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: false,
    },
    money: {
      type: Number,
      required: false,
    },
    expirationDate: {
      type: String,
      required: false,
    },
  },
  setup() {
    return { variables }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/cards/BillingCard';
</style>
