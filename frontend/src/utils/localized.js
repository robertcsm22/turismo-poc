// Devuelve el campo traducido (ej. nameEn/descriptionEn) cuando el idioma
// activo es inglés y existe traducción; si no, usa el campo original.
export function localizedField(entity, field, lang) {
  if (!entity) return ''
  if (lang?.startsWith('en')) {
    const translated = entity[`${field}En`]
    if (translated) return translated
  }
  return entity[field]
}
