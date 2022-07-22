import { SocialMediaPlatform, SocialAccountShortInfo } from './platform.model'

export interface DeleteSocialAccountRequest {
  id: string
}

export interface InstagramRequest {
  token: string
  platformId: string
  tags: Array<Tags>
}

export interface TwitchRequest {
  code: string
  tags: Array<Tags>
  redirectUrl: string
}

export interface TikTokRequest {
  code: string
  tags: Array<Tags>
}

export interface YoutubeRequest {
  code: string
  tags: Array<Tags>
  redirectUrl: string
}

export interface SocialUpdateRequest {
  id: string
  tags: Array<Tags>
}

export interface InstagramInsightGrouped {
  id?: string // >>>???? shouldng it be required?
  platformId: string
  instagramLifetimeInsightGrouped: InstagramLifetimeInsightGrouped
  userDayInsightData: Array<InsightDataResponse>
  mediaInfosGrouped: Array<InstagramMediaPublicInfo>
}

export interface InstagramLifetimeInsightGrouped {
  audienceCity: { [key: string]: number }
  audienceCountry: { [key: string]: number }
  audienceGenderAge: Array<GenderAgeGroupValue>
  audienceLocale: Array<InstagramLocaleValue>
  onlineFollowers: { [key: string]: number }
}

export interface GenderAgeGroupValue {
  gender: string
  fromAge: number
  untilAge: number
  value: number
}

export interface InstagramLocaleValue {
  country: string
  language: string
  value: number
}

export interface YoutubeMetricsGrouped {
  id?: string
  platformId: string
  youtubeLifetimeMetricsGrouped: YoutubeLifetimeMetricsGrouped
  dayMetricsInfo: Array<YoutubeDayMetricsPublicInfo>
  monthlyMetricsInfo: Array<YoutubeMonthlyMetricsPublicInfo>
}

export interface YoutubeLifetimeMetricsGrouped {
  countryMetrics: Array<CountryMetrics>
  genderMetrics: Array<GenderMetrics>
  ageGroupMetrics: Array<AgeGroupMetrics>
  youtubeFullMetrics: YoutubeFullMetrics
}

export interface CountryMetrics {
  country: string
  view: number
  comments: number
  likes: number
  dislikes: number
  videosAddedToPlaylists: number
  videosRemovedFromPlaylists: number
  shares: number
  annotationClickThroughRate: number
  annotationCloseRate: number
  annotationImpressions: number
  annotationClickableImpressions: number
  annotationClosableImpressions: number
  annotationClicks: number
  annotationCloses: number
  cardClickRate: number
  cardImpressions: number
  cardClicks: number
  cardTeaserClicks: number
  subscribersGained: number
  subscribersLost: number
  redViews: number
  estimatedMinutesWatched: number
  estimatedRedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
}

export interface GenderMetrics {
  gender: Gender
  viewerPercentage: number
}

export interface AgeGroupMetrics {
  fromAge: number
  untilAge: number
  viewerPercentage: number
}

export interface YoutubeFullMetrics {
  views: number
  comments: number
  dislikes: number
  videosAddedToPlaylists: number
  videosRemovedFromPlaylists: number
  shares: number
  annotationClickThroughRate: number
  annotationCloseRate: number
  annotationImpressions: number
  annotationClickableImpressions: number
  annotationClosableImpressions: number
  annotationClicks: number
  annotationCloses: number
  cardClickRate: number
  cardTeaserClickRate: number
  cardImpressions: number
  cardTeaserImpressions: number
  cardClicks: number
  cardTeaserClicks: number
  subscribersGained: number
  subscribersLost: number
  redViews: number
  estimatedMinutesWatched: number
  estimatedRedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
}

export interface YoutubeDayMetricsPublicInfo {
  date: string
  views: number
  comments: number
  dislikes: number
  videosAddedToPlaylists: number
  videosRemovedFromPlaylists: number
  shares: number
  annotationClickThroughRate: number
  annotationCloseRate: number
  annotationImpressions: number
  annotationClickableImpressions: number
  annotationClosableImpressions: number
  annotationClicks: number
  annotationCloses: number
  cardClickRate: number
  cardTeaserClickRate: number
  cardImpressions: number
  cardTeaserImpressions: number
  cardClicks: number
  cardTeaserClicks: number
  subscribersGained: number
  subscribersLost: number
  redViews: number
  estimatedMinutesWatched: number
  estimatedRedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
}

export interface YoutubeMonthlyMetricsPublicInfo {
  date: string
  views: number
  comments: number
  dislikes: number
  videosAddedToPlaylists: number
  videosRemovedFromPlaylists: number
  shares: number
  annotationClickThroughRate: number
  annotationCloseRate: number
  annotationImpressions: number
  annotationClickableImpressions: number
  annotationClosableImpressions: number
  annotationClicks: number
  annotationCloses: number
  cardClickRate: number
  cardTeaserClickRate: number
  cardImpressions: number
  cardTeaserImpressions: number
  cardClicks: number
  cardTeaserClicks: number
  subscribersGained: number
  subscribersLost: number
  redViews: number
  estimatedMinutesWatched: number
  estimatedRedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
}

export enum Gender {
  M = 'M',
  F = 'F',
  U = 'U',
}

interface InsightDataResponse {
  name: string
  period: string
  values: Array<InsightValueResponse>
  title: string
  description: string
  id: string
}

interface InsightValueResponse {
  value: number
  end_time?: string // shouldnt it be required as in lifetime???
}

export interface InstagramMediaPublicInfo {
  caption: string
  commentsCount: number
  likeCount: number
  mediaType: string
  date: string
  mediaInsight: InstagramMediaInsight
}

export interface InstagramMediaInsight {
  engagement: number
  impressions: number
  reach: number
  saved: number
}

export interface InstagramPublicInfo {
  username: string
  platformId: string
  accountLinked: boolean
  enabledForProposalsDate: string
  tags: Array<Tags>
  rating: number
}

export interface InstagramAccountInfo {
  username: string
  platformId: string
  accountLinked: boolean
}

export interface SocialTagWithName {
  socialTag: Tags
  name: string
}

export enum Tags {
  ACCESSORIES_JEWELLERY = 'ACCESSORIES_JEWELLERY',
  ADULT_CONTENT = 'ADULT_CONTENT',
  ALCOHOL = 'ALCOHOL',
  ANIMALS = 'ANIMALS',
  ARCHITECTURE_URBAN_DESIGN = 'ARCHITECTURE_URBAN_DESIGN',
  ART_ARTISTS = 'ART_ARTISTS',
  BEAUTY = 'BEAUTY',
  BUSINESS_CAREERS = 'BUSINESS_CAREERS',
  CARS_MOTORBIKES = 'CARS_MOTORBIKES',
  CINEMA_ACTORS_ACTRESSES = 'CINEMA_ACTORS_ACTRESSES',
  CLOTHING_OUTFITS = 'CLOTHING_OUTFITS',
  COMICS_SKETCHES = 'COMICS_SKETCHES',
  COMPUTERS_GADGETS = 'COMPUTERS_GADGETS',
  DIY_DESIGN = 'DIY_DESIGN',
  EDUCATION = 'EDUCATION',
  EXTREME_SPORTS_OUTDOOR_ACTIVITY = 'EXTREME_SPORTS_OUTDOOR_ACTIVITY',
  FAMILY = 'FAMILY',
  FASHION = 'FASHION',
  FINANCE_ECONOMICS = 'FINANCE_ECONOMICS',
  FITNESS_GYM = 'FITNESS_GYM',
  FOOD_COOKING = 'FOOD_COOKING',
  HEALTH_MEDICINE = 'HEALTH_MEDICINE',
  HUMOR_FUN_HAPPINESS = 'HUMOR_FUN_HAPPINESS',
  KIDS_TOYS = 'KIDS_TOYS',
  LIFESTYLE = 'LIFESTYLE',
  LITERATURE_JOURNALISM = 'LITERATURE_JOURNALISM',
  LUXURY = 'LUXURY',
  MACHINERY_TECHNOLOGIES = 'MACHINERY_TECHNOLOGIES',
  MANAGEMENT_MARKETING = 'MANAGEMENT_MARKETING',
  MOBILE_RELATED = 'MOBILE_RELATED',
  MODELING = 'MODELING',
  MUSIC = 'MUSIC',
  NATURE_LANDSCAPES = 'NATURE_LANDSCAPES',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  RACING_SPORTS = 'RACING_SPORTS',
  SCIENCE = 'SCIENCE',
  SHOPPING_RETAIL = 'SHOPPING_RETAIL',
  SHOWS = 'SHOWS',
  SPORTS_WITH_A_BALL = 'SPORTS_WITH_A_BALL',
  SWEETS_BAKERY = 'SWEETS_BAKERY',
  TOBACCO_SMOKING = 'TOBACCO_SMOKING',
  TRAINERS_COACHES = 'TRAINERS_COACHES',
  TRAVEL = 'TRAVEL',
  WATER_SPORTS = 'WATER_SPORTS',
  WINTER_SPORTS = 'WINTER_SPORTS',
}

export interface TagsResponse {
  [tagValue: string]: string
}

export interface TagsData {
  label: string
  value: Tags
}

export enum SocialMediaDeleteErrors {
  SOCIAL_ACCOUNT_NOT_LINKED = 'SOCIAL_ACCOUNT_NOT_LINKED',
}

export enum SocialMediaEditErrors {
  SOCIAL_ACCOUNT_NOT_LINKED = 'SOCIAL_ACCOUNT_NOT_LINKED',
}

export interface SocialAccountWithPlatform {
  account: SocialAccountShortInfo
  platform: SocialMediaPlatform
}
