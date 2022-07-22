import { reactive } from 'vue'
import useValidation from '@/components/helpers/validate'
import { CurrencyValue } from '@/types/money.model'

const ERRORS = {
  value: `Field can't be empty`,
}

export function useDepositFundsValidation() {
  const validate = useValidation()
  const errors = reactive({
    value: '',
  })

  const clear = () => {
    errors.value = ''
  }

  const validation = (depositFundsData: CurrencyValue) => {
    clear()

    let passValidation = true

    if (typeof depositFundsData.value === 'string' || !validate.number.range(depositFundsData.value, 1, 99999)) {
      passValidation = false
      errors.value = ERRORS.value
    }

    return passValidation
  }

  return { validation, errors }
}
