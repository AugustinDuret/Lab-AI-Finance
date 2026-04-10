import { useState, useEffect } from 'react'
import { translations } from '../data/translations.js'

const STORAGE_KEY = 'lab_ai_lang'

export function useLanguage() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'fr'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const t = translations[lang]
  const toggleLang = () => setLang(prev => prev === 'fr' ? 'en' : 'fr')

  return { lang, toggleLang, t }
}
