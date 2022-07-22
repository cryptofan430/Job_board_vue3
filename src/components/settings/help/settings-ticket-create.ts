import useTicketsController from '@/middleware/controllers/useTicketsController'
import useToastsStore from '@/store/toasts'
import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { getFirstError } from '@/services/api'
import { CreateTicketError } from '@/types/tickets'
import { AxiosError } from 'axios'
import { ref } from 'vue'

export default function useSettingsTicketsCreate() {
  const { required } = useValidators()
  const { createTicket } = useTicketsController()
  const { addToast } = useToastsStore()
  const isCreatingTicket = ref(false)

  const createSettingsTicketsForm = () => {
    const description = createFormItem('', { validators: [required] })

    return createFormFieldSet({
      description,
    })
  }

  const ticketForm = createSettingsTicketsForm()

  const submitForm = async () => {
    const isValid = ticketForm.validate()
    if (!isValid) return

    const ticketData = ticketForm.getValue()
    isCreatingTicket.value = true

    return await createTicket(ticketData)
      .then((response) => {
        ticketForm.fieldSet.description.value = ''
        addToast('Successfully created a ticket', 'success')
        return response
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<CreateTicketError>(e)
        if (error?.errorType === CreateTicketError.OPEN_TICKET_ALREADY_EXIST) {
          addToast('Ticket that you are trying to create is already exist', 'danger')
        } else if (error?.errorType === CreateTicketError.DAILY_LIMIT_REACHED) {
          addToast('You reached the daily limit of actions', 'danger')
        } else {
          ticketForm.setError('Unexpected error occurred please check your internet connection and try again')
        }
      })
      .finally(() => {
        isCreatingTicket.value = false
      })
  }

  return {
    ticketForm,
    isCreatingTicket,
    submitForm,
  }
}
