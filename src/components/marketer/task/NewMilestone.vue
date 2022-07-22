<template>
  <div class="milestone">
    <p class="counter">{{ counter }}.</p>
    <p class="mobile-counter">{{ stringifyNumber(counter) }} milestone</p>

    <div class="form-wrapper">
      <div class="name-with-budget">
        <AppLabel class="name" size="sm">
          Name the milestone
          <AppInput
            v-model="title.value"
            size="md"
            short
            :error="title.isError"
            @update:modelValue="title.setNormalState"
          />
        </AppLabel>

        <AppLabel class="budget" size="sm">
          Amount
          <div class="budget-input-wrapper" data-currency="$">
            <AppInput
              v-model="budget.value"
              type="number"
              size="sm"
              short
              :error="budget.isError"
              @update:modelValue="budget.setNormalState"
            />
          </div>
        </AppLabel>

        <AppButton icon="delete" :disabled="actionsDisabled" @click="deleteMilestone" />
      </div>
      <AppError v-if="title.isError || budget.isError">Milestone name and budget are required</AppError>

      <AppLabel class="description" size="sm">
        Describe tasks, included in this milestone
        <AppTextarea
          v-model="description.value"
          :error="description.isError"
          @update:modelValue="description.setNormalState"
        />
      </AppLabel>

      <AppError v-if="description.isError">Task description is required</AppError>
      <p class="remove-this-milestone" @click="deleteMilestone">Remove this milestone</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppError from '@/components/common/AppInputError.vue'
import { MileStoneForm } from '@/types/forms.model'

export default defineComponent({
  name: 'NewMilestone',
  components: {
    AppButton,
    AppInput,
    AppTextarea,
    AppLabel,
    AppError,
  },
  props: {
    counter: {
      type: Number,
      required: true,
    },
    milestoneId: {
      type: Number,
      required: true,
    },
    mileStoneForm: {
      type: Object as PropType<MileStoneForm>,
      required: true,
    },
    actionsDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['delete-milestone'],
  setup(props, { emit }) {
    const { title, budget, description } = toRefs(props.mileStoneForm.fieldSet)

    const deleteMilestone = () => {
      emit('delete-milestone')
    }

    const special = [
      'Zeroth',
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Ninth',
      'Tenth',
      'Eleventh',
      'Twelfth',
      'Thirteenth',
      'Fourteenth',
      'Fifteenth',
      'Sixteenth',
      'Seventeenth',
      'Eighteenth',
      'Nineteenth',
    ]
    const deca = ['Twent', 'Thirt', 'Fort', 'Fift', 'Sixt', 'Sevent', 'Eight', 'Ninet']

    const stringifyNumber = (n: number) => {
      if (n < 20) return special[n]
      if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth'
      return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10]
    }

    return {
      title,
      budget,
      description,
      deleteMilestone,
      stringifyNumber,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/NewMilestone';
</style>
