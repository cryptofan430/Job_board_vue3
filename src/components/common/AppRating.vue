<template>
  <div class="rating-root" :class="classList">
    <div class="rating-row">
      <p class="rating-label">{{ textLeft }}</p>
      <div class="rating-item">
        <input
          ref="rating1El"
          :value="1"
          :checked="modelValue === 1"
          class="rating-input"
          type="radio"
          :name="radioName"
          @change="handleChangeEvent"
        />
      </div>

      <div class="rating-item">
        <input
          ref="rating2El"
          :value="2"
          :checked="modelValue === 2"
          class="rating-input"
          type="radio"
          :name="radioName"
          @change="handleChangeEvent"
        />
      </div>

      <div class="rating-item">
        <input
          ref="rating3El"
          :value="3"
          :checked="modelValue === 3"
          class="rating-input"
          type="radio"
          :name="radioName"
          @change="handleChangeEvent"
        />
      </div>

      <div class="rating-item">
        <input
          ref="rating4El"
          :value="4"
          :checked="modelValue === 4"
          class="rating-input"
          type="radio"
          :name="radioName"
          @change="handleChangeEvent"
        />
      </div>

      <div class="rating-item">
        <input
          ref="rating5El"
          :value="5"
          :checked="modelValue === 5"
          class="rating-input"
          type="radio"
          :name="radioName"
          @change="handleChangeEvent"
        />
      </div>
      <p class="rating-label">{{ textRight }}</p>
    </div>

    <div class="rating-row">
      <div role="presentation" class="empty-cell"></div>
      <p class="rating-numeric-label">1</p>
      <p class="rating-numeric-label">2</p>
      <p class="rating-numeric-label">3</p>
      <p class="rating-numeric-label">4</p>
      <p class="rating-numeric-label">5</p>
      <div role="presentation" class="empty-cell"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    radioName: {
      type: String,
      default: 'rating-input',
    },
    modelValue: {
      type: Number,
      required: false,
    },
    error: {
      type: Boolean,
      required: false,
    },
    textLeft: {
      type: String,
      default: 'Unpleasant',
    },
    textRight: {
      type: String,
      default: 'Perfect',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateRatingValue = (value: number) => {
      emit('update:modelValue', value)
    }

    const classList = computed(() => {
      const errorClasses = props.error ? '--error' : ''
      return `${errorClasses}`
    })

    const handleChangeEvent = (e: InputEvent) => {
      const target = e.target as HTMLInputElement

      if (target.checked) {
        updateRatingValue(+target.value)
      }
    }
    return {
      classList,
      updateRatingValue,
      handleChangeEvent,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppRating';
</style>
