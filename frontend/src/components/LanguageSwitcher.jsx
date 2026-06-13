import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'es'

  const setLang = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="language switcher">
      <button
        type="button"
        className={`btn ${current === 'es' ? 'btn-light' : 'btn-outline-light'}`}
        onClick={() => setLang('es')}
        aria-pressed={current === 'es'}
      >
        ES
      </button>
      <button
        type="button"
        className={`btn ${current === 'en' ? 'btn-light' : 'btn-outline-light'}`}
        onClick={() => setLang('en')}
        aria-pressed={current === 'en'}
      >
        EN
      </button>
    </div>
  )
}
