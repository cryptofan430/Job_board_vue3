import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { scrollToPageTop } from '@/components/helpers/dom'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import {
  AdminDisputePagination,
  AdminJoinDisputeChatError,
  AdminJoinRegularChatError,
  DisputeAdminInfo,
} from '@/types/disputes'
import useDisputesParams from '@/components/marketer/admin/disputes/disputes-params'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import useAdminDisputesStore from '@/store/admin-disputes'
import { PaginationPages } from '@/types/api.model'
import useToastsStore from '@/store/toasts'
import router from '@/router'
import { getFirstError } from '@/services/api'
import { AxiosError } from 'axios'

export default function useAdminDisputes() {
  const {
    getAdminDisputes,
    getAdminDisputeCount,
    adminDisputesState,
    disputesCache,
    setAdminDisputes,
    setAdminDisputesCount,
    setAdminDisputesState,
    getFirstDispute,
    getLastDispute,
  } = useAdminDisputesStore()
  const { paginationPayload, disputePerPage, disputesPagination, disputesFilters, updateQueryParams } =
    useDisputesParams()
  const { getAdminDisputes: fetchAdminDisputes, adminJoinDisputeChat, adminJoinRegularChat } = useDisputesController()
  const { addToast } = useToastsStore()

  const activePage = computed(() => disputesPagination.skip / disputesPagination.limit + 1)
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(adminDisputesState)

  const _fetchDisputes = async (params: AdminDisputePagination & PaginationPages) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, disputesCache)

    if (cachedEntities) {
      setAdminDisputes(cachedEntities)
    }

    if (extractCurrentEntities) {
      return await fetchAdminDisputes(updatedParams as AdminDisputePagination).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.disputes)

        if (calcEntitiesCount) setAdminDisputesCount(calcEntitiesCount(response.data.count))
        if (!cachedEntities) setAdminDisputes(currentPageEntities)
      })
    }
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstDispute = getFirstDispute()
    const lastDispute = getLastDispute()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstDispute?.id
    paginationPayload.olderThanId = lastDispute?.id

    updateQueryParams({ page: targetPage })
  }

  const fetchDisputesWithNewParams = () => {
    _fetchDisputes({
      ...disputesFilters,
      ...paginationPayload,
      ...disputesPagination,
      targetPage: activePage.value,
    })
      .then(() => setAdminDisputesState('loaded'))
      .catch((e) => setAdminDisputesState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchDisputes = () => {
    setAdminDisputesState('loading')
    fetchDisputesWithNewParams()
  }

  const joinDisputeChat = (dispute: DisputeAdminInfo) => {
    if (!dispute.joinedDisputeChat) {
      adminJoinDisputeChat(dispute.id)
        .then((response) => {
          router.push({
            name: 'SelectedChat',
            params: {
              chatId: response.data.chatId,
            },
          })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AdminJoinDisputeChatError>(e)
          if (error?.errorType === AdminJoinDisputeChatError.DISPUTE_ALREADY_CLOSED) {
            addToast('Dispute is already closed', 'danger')
          } else if (error?.errorType === AdminJoinDisputeChatError.DISPUTE_NOT_EXIST) {
            addToast('Dispute chat does not exist', 'danger')
          } else if (error?.errorType === AdminJoinDisputeChatError.JOINED_CHAT_ALREADY) {
            addToast('You have already joined to dispute chat', 'danger')
          } else {
            addToast('Unexpected error occurred, please check your internet connection', 'danger')
          }
        })
    }
    if (dispute.joinedDisputeChat) {
      router.push({
        name: 'SelectedChat',
        params: {
          chatId: dispute.chatId,
        },
      })
    }
  }

  const joinRegularChat = (dispute: DisputeAdminInfo) => {
    if (!dispute.joinedRegularChat) {
      adminJoinRegularChat(dispute.id)
        .then(() => {
          // TODO: Add correct redirect
          router.push({
            name: 'Chat',
            params: {
              // chatId: getAdminDispute.value.chatId || '',
            },
          })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AdminJoinRegularChatError>(e)
          if (error?.errorType === AdminJoinRegularChatError.CHAT_NOT_EXIST) {
            addToast('Chat does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.CONTRACT_NOT_EXIST) {
            addToast('Contract does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.DISPUTE_NOT_EXIST) {
            addToast('Dispute does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.PROPOSAL_NOT_EXIST) {
            addToast('Proposal does not exist', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.JOINED_CHAT_ALREADY) {
            addToast('You have already joined to dispute chat', 'danger')
          } else {
            addToast('Unexpected error occurred, please check your internet connection', 'danger')
          }
        })
    }
    if (dispute.joinedRegularChat) {
      // TODO: Add correct redirect
      router.push({
        name: 'Chat',
        params: {
          // chatId: dispute?.chatId,
        },
      })
    }
  }
  const updateFilters = (filters: Record<string, unknown>) => {
    disputesCache.clear()
    updateQueryParams({
      ...filters,
      page: 1,
    })
  }

  const watchPageLimits = createPageLimitsWatcher(getAdminDisputes, getAdminDisputeCount, activePage, updatePage)
  const watchFilters = () => {
    watch(disputesPagination, fetchDisputesWithNewParams)
  }

  return {
    disputesFilters,
    getAdminDisputes,
    getAdminDisputeCount,
    adminDisputesState,
    disputePerPage,
    isLoaded,
    isError,
    isLoading,
    activePage,
    refetchDisputes,
    watchPageLimits,
    watchFilters,
    updatePage,
    joinDisputeChat,
    joinRegularChat,
    updateQueryParams,
    updateFilters,
  }
}
