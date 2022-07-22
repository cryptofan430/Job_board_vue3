import { useRouter } from 'vue-router'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useContractController from '@/middleware/controllers/useContractController'
import useContractAcceptStore from '@/store/contract-accept'
import useToastsStore from '@/store/toasts'
import useInfluencerContractManagementStore from '@/store/influencer-contract-management'

export default function useContractAccept() {
  const router = useRouter()
  const contractId = useStringPathParamReactive('contractId')
  const { fetchContractWithTask, acceptContract, deleteContract } = useContractController()
  const {
    getTaskContract,
    isWaitingActionResponse,
    isAcceptingContract,
    isDecliningContract,
    taskContactState,
    setTaskContract,
    setTaskContractsState,
    setAcceptingContract,
    setDecliningContract,
  } = useContractAcceptStore()

  const { addToast } = useToastsStore()
  const { setTaskContract: setManagementTakContract } = useInfluencerContractManagementStore()

  const { isError, isLoaded, isLoading } = extractEntitiesLoadingState(taskContactState)

  const initTaskContract = () => {
    if (getTaskContract.value?.contract?.id !== contractId.value) setTaskContract(undefined)

    if (getTaskContract.value?.contract?.accepted) {
      // add contract management setter when store will be implemented
      const taskId = getTaskContract.value?.task?.id || ''
      return router.push({
        name: 'ContractManagement',
        params: { taskId, contractId: contractId.value },
      })
    }

    if (!getTaskContract.value) {
      setTaskContractsState('loading')
      fetchContractWithTask(contractId.value)
        .then((response) => {
          setTaskContractsState('loaded')
          if (response.data.contract?.accepted) {
            const taskId = response.data.task?.id || ''
            setManagementTakContract(response.data)
            return router.push({
              name: 'ContractManagement',
              params: { taskId, contractId: contractId.value },
            })
          }
          setTaskContract(response.data)
        })
        .catch(() => {
          setTaskContractsState('error')
        })
    }
  }

  const doAcceptContract = () => {
    const taskId = getTaskContract.value?.task?.id || ''
    const taskContract = getTaskContract.value
    setAcceptingContract(true)

    acceptContract(contractId.value)
      .then((response) => {
        if (taskContract) {
          const updatedTaskContract = {
            ...taskContract,
            contract: response.data,
          }
          updatedTaskContract.task.hasContractAccepted = true
          setManagementTakContract(updatedTaskContract)
          setTaskContract(updatedTaskContract)
        }
        router.push({
          name: 'ContractManagement',
          params: { taskId, contractId: contractId.value },
        })
      })
      .catch(() => addToast('An error occurred when accepting a contract', 'danger'))
      .finally(() => {
        setAcceptingContract(false)
      })
  }

  const declineContract = () => {
    setDecliningContract(true)

    deleteContract(contractId.value)
      .then(() => {
        router.push({ name: 'Tasks' })
      })
      .catch(() => addToast('An error occurred when declining a contract', 'danger'))
      .finally(() => {
        setDecliningContract(false)
      })
  }

  return {
    isError,
    isLoaded,
    isLoading,
    isWaitingActionResponse,
    isDecliningContract,
    isAcceptingContract,
    getTaskContract,
    initTaskContract,
    setTaskContract,
    setTaskContractsState,
    doAcceptContract,
    declineContract,
  }
}
