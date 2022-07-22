import { reactive } from 'vue'
import useValidation from '@/components/helpers/validate'

import { ProposalToAdd, ProposalUpdateData } from '@/types/proposal.model'

const ERRORS = {
  description: `Cannot be empty`,
}

export function useSubmitProposalDataValidation() {
  const validate = useValidation()
  const errors = reactive({
    description: '',
  })

  const clear = () => {
    errors.description = ''
  }

  const validation = (proposalData: ProposalToAdd | ProposalUpdateData) => {
    clear()

    let passValidation = true

    if (typeof proposalData.description !== 'string' || !validate.string.length(proposalData.description, 1)) {
      passValidation = false
      errors.description = ERRORS.description
    }

    return passValidation
  }

  return { validation, errors }
}
