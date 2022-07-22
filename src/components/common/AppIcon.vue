<template>
  <component
    :is="component"
    :color="color"
    :notify="notify"
    :pass-visible="passVisible"
    :size="size"
    :fill="fill"
    :outline="outline"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AttachIcon from './icons/AttachIcon.vue'
import BackIcon from './icons/BackIcon.vue'
import CameraIcon from './icons/CameraIcon.vue'
import ChatIcon from './icons/ChatIcon.vue'
import ChatSendIcon from './icons/ChatSendIcon.vue'
import CloseIcon from './icons/CloseIcon.vue'
import DeletedMessageIcon from './icons/DeletedMessageIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import DetailsIcon from './icons/DetailsIcon.vue'
import DropdownIcon from './icons/DropdownIcon.vue'
import EditIcon from './icons/EditIcon.vue'
import FacebookIcon from './icons/FacebookIcon.vue'
import FilterIcon from './icons/FilterIcon.vue'
import FollowersIcon from './icons/FollowersIcon.vue'
import InstagramIcon from './icons/InstagramIcon.vue'
import InvoiceIcon from './icons/InvoiceIcon.vue'
import LocationIcon from './icons/LocationIcon.vue'
import LogotypeIcon from './icons/LogotypeIcon.vue'
import LogoutIcon from './icons/LogoutIcon.vue'
import MailIcon from './icons/MailIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'
import MoneyEarnedIcon from './icons/MoneyEarnedIcon.vue'
import MoneySpentIcon from './icons/MoneySpentIcon.vue'
import NotificationIcon from './icons/NotificationIcon.vue'
import PassIcon from './icons/PassIcon.vue'
import ProfileIcon from './icons/ProfileIcon.vue'
import QuoteIcon from './icons/QuoteIcon.vue'
import RatingIcon from './icons/RatingIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'
import SortingIcon from './icons/SortingIcon.vue'
import YoutubeIcon from './icons/YoutubeIcon.vue'
import TwitchIcon from './icons/TwitchIcon.vue'
import TiktokIcon from './icons/TikTok.vue'
import SuccessMessageIcon from './icons/SuccessMessageIcon.vue'
import DangerMessageIcon from './icons/DangerMessageIcon.vue'
import InfoMessageIcon from './icons/InfoMessageIcon.vue'
import WarningIcon from './icons/WarningIcon.vue'

export type IconName =
  | 'attach'
  | 'back'
  | 'camera'
  | 'chat'
  | 'chat-send'
  | 'close'
  | 'deleted-message'
  | 'delete'
  | 'details'
  | 'dropdown'
  | 'edit'
  | 'facebook'
  | 'filter'
  | 'followers'
  | 'instagram'
  | 'invoice'
  | 'location'
  | 'logotype'
  | 'logout'
  | 'mail'
  | 'money-earned'
  | 'money-spent'
  | 'notification'
  | 'pass'
  | 'profile'
  | 'quote'
  | 'rating'
  | 'search'
  | 'settings'
  | 'sorting'
  | 'tiktok'
  | 'twitch'
  | 'youtube'
  | 'success-message'
  | 'danger-message'
  | 'info-message'
  | 'warning'

export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

export default defineComponent({
  name: 'AppIcon',
  components: {
    AttachIcon,
    BackIcon,
    CameraIcon,
    ChatIcon,
    ChatSendIcon,
    CloseIcon,
    DeletedMessageIcon,
    DeleteIcon,
    DetailsIcon,
    DropdownIcon,
    EditIcon,
    FacebookIcon,
    FilterIcon,
    FollowersIcon,
    InstagramIcon,
    InvoiceIcon,
    LocationIcon,
    LogotypeIcon,
    LogoutIcon,
    MailIcon,
    MenuIcon,
    MoneyEarnedIcon,
    MoneySpentIcon,
    NotificationIcon,
    PassIcon,
    TiktokIcon,
    ProfileIcon,
    QuoteIcon,
    RatingIcon,
    SearchIcon,
    SettingsIcon,
    SortingIcon,
    TwitchIcon,
    YoutubeIcon,
    SuccessMessageIcon,
    DangerMessageIcon,
    InfoMessageIcon,
    WarningIcon,
  },
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    fill: {
      type: String,
      required: false,
    },
    size: {
      type: String as PropType<IconSize>,
      required: false,
    },
    notify: {
      type: Boolean,
      default: false,
    },
    passVisible: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const component = computed(() => {
      const splittedWords = props.name.split('-')
      const splittedUppercaseWords = splittedWords.map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)

      return `${splittedUppercaseWords.join('')}Icon`
    })

    return { component }
  },
})
</script>

<style lang="scss" scoped>
.icon {
  user-select: none;
  pointer-events: none;
}
</style>
