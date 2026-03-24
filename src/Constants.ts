export const Constants = {
  SITE_TITLE: 'Saqo Hair Salon',
  WEBSITE_URL: 'https://saqo-hair-salon.web.app',
  PAGES: {
    DISCOVER: '/',
  },
  SOCIALS: {
    FACEBOOK: 'https://www.facebook.com',
    LINKEDIN: 'https://www.linkedin.com/',
    INSTAGRAM: 'https://www.instagram.com/',
  },
  SHARER: {
    X: (url = '', text = '') =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    FB: (url = '') =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    DISCORD: () =>
      `https://discord.com/channels/@me`, // no direct share URL support
    LINKEDIN: (url = '') =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    TELEGRAM: (url = '', text = "") =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  GOOGLE_MAPS: 'https://maps.app.goo.gl/sEYuGdvYvDmXgqeh9',
  ADDRESS: 'Çair, Shkup',
  LOCATION: 'North Macedonia, Skopje, Çair 1000',
  EMAIL: 'info@saqohairsalon.com',
  CONTACT_NUMBER: '+389 70 336 332',
  CONTACT_NUMBER_SHORT: '070 336 332',
}

export const DATE_FORMAT = {
  'Dayth M Y': 'do MMMM yyyy', // Thursday, 08 May
  'Day.Month.Year': 'dd.MM.yyyy', // 08.05.2025
  'D Month Y': 'dd MMM yyyy', // 08.05.2025
  'Y_M_D': 'yyyy-MM-dd', // 2025-05-24
  'Day.Month.Year.Time': 'dd.MM.yyyy HH:mm', // 08.05.2025 00:00
  'MONTH_TEXT': 'MMM', // May
  'Day. Y Month HH:MM': 'EEE. d MMMM - HH:mm', // Thu. 8 May - 00:00
  'Y': 'yyyy', // 8 May
  'Y Month': 'd MMMM', // 8 May
  'Month, Year': 'MMMM, yyyy', // NOV, 2020
}
