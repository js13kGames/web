import { writable } from 'svelte/store'

const
  KEY_CATEGORIES = 'categories'

export const cats = writable(JSON.parse(localStorage.getItem(KEY_CATEGORIES)) ?? 255)

cats.subscribe(v => {
  if (v !== null) {
    localStorage.setItem(KEY_CATEGORIES, v)
  }
})