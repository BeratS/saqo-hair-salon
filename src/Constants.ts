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
    X: (url: string, text?: string) => `https://x.com/intent/tweet?url=${url}`, // &via=getboldify&text=yourtext
    FB: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    DISCORD: (url: string) => `https://discord.com/channels/@me`,
    LINKEDIN: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    TELEGRAM: (url: string, text?: string) => `https://t.me/share/url?url=${url}`, // &text=YOUR_TEXT
  },
  GOOGLE_MAPS: 'https://maps.app.goo.gl/sEYuGdvYvDmXgqeh9',
  ADDRESS: 'Arhiepiskop Dositej 11 Skopje, Çair 1000',
  LOCATION: 'North Macedonia, Skopje, Çair 1000',
  EMAIL: 'info@saqohairsalon.com',
  CONTACT_NUMBER: '+389 70 336 332',
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
