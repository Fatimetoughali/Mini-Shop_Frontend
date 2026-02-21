import { createI18n } from 'vue-i18n'
import fr from './fr'
import ar from './ar'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    ar,
  },
})

export default i18n
