import { createFormItem, createFormFieldSet, useValidators } from '@/components/helpers/forms'
import { TaskSocialMediaPlatform } from '@/types/platform.model'
import { TaskPublicInfo } from '@/types/tasks.model'

export default function useTaskEditForm() {
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

    const id = createFormItem('')
    const title = createFormItem('', { validators: titleValidators })
    const description = createFormItem('', {
      validators: descriptionValidators,
    })
    const budget = createFormItem<number>(undefined, {
      validators: budgetValidators,
    })
    const platforms = createFormItem<Array<TaskSocialMediaPlatform>>([], {
      validators: platformsValidator,
    })

    return createFormFieldSet({
      id,
      title,
      description,
      budget,
      platforms,
    })
  }

  const taskEditForm = createTaskForm()

  const assignValue = (value: TaskPublicInfo) => {
    const { id, budget, description, platforms, title } = taskEditForm.fieldSet

    id.value = value.id
    budget.value = value.budget.value
    description.value = value.description
    platforms.value = value.platforms
    title.value = value.title

    taskEditForm.fieldSet.description.value = value.description
  }

  return {
    taskEditForm,
    assignValue,
  }
}
