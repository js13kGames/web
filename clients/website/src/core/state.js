import { writable } from 'svelte/store'

export const edition  = writable(10) // 0-indexed (i.e. 0 corresponds to 2012)
export const gaming   = writable(0)
export const dark     = writable(0)