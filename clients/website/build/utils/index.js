const
  RE_Control   = /[\u0000-\u001f]/g,
  RE_Special   = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g,
  RE_Combining = /[\u0300-\u036F]/g

export function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(RE_Combining, '') // Remove accents.
    .replace(RE_Control, '')   // Remove control characters.
    .replace(RE_Special, '-')  // Replace special characters.
    .replace(/-{2,}/g, '-')    // Remove continues separators.
    .replace(/^-+|-+$/g, '')   // Remove prefixing and trailing separators.
    .replace(/^(\d)/, '_$1')   // Ensure it doesn't start with a number.
    .toLowerCase()
}

const
  PRIME = 16777619,
  BASE  = 2166136261

export function fnv(str, c) {
  let v = BASE

  for (let i = 0; i < str.length; i++) {
    v ^= str.charCodeAt(i)
    v = Math.imul(v, PRIME)
  }

  v = (v >>> 0).toString(32)

  return !c
    ?       v.substr(0, 6)
    : 'c' + v.substr(3, 3)
}