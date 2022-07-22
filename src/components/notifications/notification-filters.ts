import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { notificationsPerPage } from '@/components/constants/notifications'
import { createPaginationPayload } from '../helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useNotificationParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const notificationsPagination: BasicPagination = reactive({
    limit: notificationsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * notificationsPerPage),
    newerThanId: undefined,
    olderThanId: undefined,
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    notificationsPagination,
    paginationPayload,
    notificationsPerPage,
  }
}

export default function useNotificationFilters() {
  const { notificationsPagination, notificationsPerPage, paginationPayload } = useNotificationParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    notificationsPagination,
    updateRouteParams,
    notificationsPerPage,
    paginationPayload,
  }
}
