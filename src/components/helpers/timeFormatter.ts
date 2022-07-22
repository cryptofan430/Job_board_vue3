const MS_IN_SEC = 1000
const MS_IN_MIN = MS_IN_SEC * 60
const MS_IN_H = MS_IN_MIN * 60
const MS_IN_D = MS_IN_H * 24
const MS_IN_M = MS_IN_D * 30.416
const MS_IN_Y = MS_IN_D * 365
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const getTimeEllapsed = (date?: string) => {
  if (!date?.length) return { time: 0, unit: 'seconds' }

  const time = Date.now() - Date.parse(date)

  let value = 1
  let suffix = 'second'

  if (time < MS_IN_MIN) {
    value = time / MS_IN_SEC
    suffix = 'second'
  } else if (time < MS_IN_H) {
    value = time / MS_IN_MIN
    suffix = 'minute'
  } else if (time < MS_IN_D) {
    value = time / MS_IN_H
    suffix = 'hour'
  } else if (time < MS_IN_M) {
    value = time / MS_IN_D
    suffix = 'day'
  } else if (time < MS_IN_Y) {
    value = time / MS_IN_M
    suffix = 'month'
  } else {
    value = time / MS_IN_Y
    suffix = 'year'
  }

  return {
    time: Math.max(Math.floor(value), 0),
    unit: Math.floor(value) === 1 ? suffix : `${suffix}s`,
  }
}

export const getTimeEllapsedFromNow = (date?: string) => {
  if (!date?.length) return { time: 0, unit: 'seconds' }

  const time = Date.parse(date) - Date.now()

  let value = 1
  let suffix = 'second'

  if (time < MS_IN_MIN) {
    value = time / MS_IN_SEC
    suffix = 'second'
  } else if (time < MS_IN_H) {
    value = time / MS_IN_MIN
    suffix = 'minute'
  } else if (time < MS_IN_D) {
    value = time / MS_IN_H
    suffix = 'hour'
  } else if (time < MS_IN_M) {
    value = time / MS_IN_D
    suffix = 'day'
  } else if (time < MS_IN_Y) {
    value = time / MS_IN_M
    suffix = 'month'
  } else {
    value = time / MS_IN_Y
    suffix = 'year'
  }

  return {
    time: Math.max(Math.floor(value), 0),
    unit: Math.floor(value) === 1 ? suffix : `${suffix}s`,
  }
}

export const getDate = (isodate: string) => {
  const date = new Date(isodate)

  const day = date.getUTCDate()
  const dayOfWeek = DAYS_OF_WEEK[date.getUTCDay()]

  const month = date.toLocaleString('en-us', { month: '2-digit' })
  const humanMonth = date.toLocaleString('en-us', { month: 'long' })

  const year = date.toLocaleString('en-us', { year: 'numeric' })

  return {
    month,
    humanMonth,
    day,
    dayOfWeek,
    year,
  }
}

export const getFormattedRelativeDate = (date: string) => {
  const { time, unit } = getTimeEllapsed(date)
  return `Added ${time} ${unit} ago`
}

export const getDateAbsoluteFormatted = (date: string | Date | number, fullYear = false) => {
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.getMonth() + 1
  const monthFormatted = month.toString().length === 1 ? '0' + month : month.toString()

  const year = dateObj.getFullYear()
  const yearFormatted = year?.toString().substring(fullYear ? 0 : 2, 4)

  return `${day}/${monthFormatted}/${yearFormatted}`
}

export const getMessageTimeFormatted = (date: string | Date | number) => {
  const dateObj = new Date(date)

  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const dayOfMonth = dateObj.getDate()

  const today = new Date()

  const yearToday = today.getFullYear()
  const monthToday = today.getMonth()
  const dayOfMonthToday = today.getDate()

  const isToday = year === yearToday && month === monthToday && dayOfMonth === dayOfMonthToday

  if (isToday) {
    const timeHours = dateObj.getHours()
    const timeMinutes = dateObj.getMinutes()

    const displayMinutes = timeMinutes <= 9 ? '0' + timeMinutes : timeMinutes.toString()
    let displayTimeHours = timeHours < 1 ? 12 : timeHours

    const isPm = timeHours >= 12

    if (timeHours >= 13) displayTimeHours -= 12

    return `${displayTimeHours}:${displayMinutes} ${isPm ? 'PM' : 'AM'}`
  }

  const { time, unit } = getTimeEllapsed(date.toString())

  return `${time} ${unit} ago`
}
