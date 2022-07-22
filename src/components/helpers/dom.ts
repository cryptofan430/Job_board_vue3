import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

export const scrollToPageBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
  })
}

export const getElementAbsoluteCoords = (el: HTMLElement) => {
  const { left, top } = el.getBoundingClientRect()
  const documentScrollTop = document.documentElement?.scrollTop || window.scrollY
  const documentScrollLeft = document.documentElement?.scrollLeft || window.scrollX

  const scrollTop = documentScrollTop
  const scrollLeft = documentScrollLeft

  return {
    top: scrollTop + top,
    left: scrollLeft + left,
  }
}

export const setTitle = (title: string) => {
  document.title = title
}
export const getIsMobilePhone = () => {
  const mediaMatcher = window.matchMedia('(max-width: 640px)')
  const isMobilePhone = ref(mediaMatcher.matches)

  const matchFunction = (e: Event & { matches: boolean }) => {
    isMobilePhone.value = e.matches
  }

  mediaMatcher.addEventListener('change', matchFunction)

  onBeforeUnmount(() => {
    mediaMatcher.removeEventListener('change', matchFunction)
  })

  return isMobilePhone
}

export const getIsMobilePopup = () => {
  const route = useRoute()
  const isMobilePhone = getIsMobilePhone()
  const isMobileAndPopup = computed(() => isMobilePhone.value && route.meta?.isPopup)

  return isMobileAndPopup
}

export const scrollToPageTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
