import { createFormItem, createFormFieldSet, useValidators } from '@/components/helpers/forms'
import { Currency } from '@/types/money.model'
import { TaskSocialMediaPlatform } from '@/types/platform.model'

export const useTaskCreateForm = () => {
  const { stringMinLength, stringMaxLength, numberMinValue, arrayMinLength } = useValidators()

  const createTaskForm = () => {
    const titleValidators = [
      stringMinLength(1, () => 'Title must have at least 1 character'),
      stringMaxLength(50, () => 'Title must have at most 50 characters'),
    ]
    const descriptionValidators = [
      stringMinLength(1, () => 'Description must have at least 1 character'),
      stringMaxLength(1000, () => 'Description must have at most 1000 characters'),
    ]
    const budgetValidators = [numberMinValue(0, () => 'Budget must be higher or equal to 0')]
    const platformsValidator = [arrayMinLength(1, () => 'At least one platform has to be chosen')]

    const title = createFormItem('', { validators: titleValidators })
    const description = createFormItem('', {
      validators: descriptionValidators,
    })
    const budgetValue = createFormItem<number>('' as unknown as number, {
      validators: budgetValidators,
    })
    const platforms = createFormItem<Array<TaskSocialMediaPlatform>>(
      [
        TaskSocialMediaPlatform.INSTAGRAM,
        TaskSocialMediaPlatform.TWITCH,
        TaskSocialMediaPlatform.YOUTUBE,
        TaskSocialMediaPlatform.TIKTOK,
        TaskSocialMediaPlatform.OTHER,
      ],
      {
        validators: platformsValidator,
      }
    )

    return createFormFieldSet({
      title,
      description,
      budget: createFormFieldSet({
        currency: createFormItem<Currency>(Currency.USD),
        value: budgetValue,
      }),
      platforms,
    })
  }

  const taskCreateForm = createTaskForm()

  return {
    taskCreateForm,
  }
}
