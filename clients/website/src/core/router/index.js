import { writable }  from 'svelte/store'

import Games from '../../modules/games/Module.svelte'
import Error from './Error.svelte'

export const loc = !import.meta.env.SSR ? location : {}

const locate = _ => ({
  path:   loc.pathname,
  qs:     new URLSearchParams(loc.search),
  params: {}
})

let
  path,
  manual,
  qs


if (!import.meta.env.SSR) {
  onpopstate   = _ => update()
  onhashchange = _ => hash(loc.hash)
  onclick      = e => {
    const t = e.target.closest('a[href]')
    if (!t) return

    const h = t.getAttribute('href')

    // Aggressive, but this allows us to avoid having to explicitly handle external links through rels or some such.
    // Tackles protocol relative URLS and links starting with 'ht', which is sufficient for us to qualify those
    // as external as long as we uphold the convention of using host relative URLs for internal links (and no route
    // actually starts with 'ht').
    if ((h[0] === '/' && h[1] === '/') || (h[0] === 'h' && h[1] === 't')) {
      return
    }

    e.preventDefault()

    if (h !== loc.pathname) {
      history.pushState({}, '', h)

      h[0] === '#'
        ? hash(h)
        : update()
    }
  }

  // TODO(alcore) Temporary soft-redirect until we've got an actual homepage.
  if (loc.pathname === '/') {
    history.replaceState({}, '', '/games')
  }

  function hash(h) {
    // TODO(alcore) Defer until after import and load if this involves an actual module change.
    let t = document.getElementById(h.substring(1))
    if (t) {
      t.scrollIntoView({behavior: 'smooth'})
    }
  }
}

export const component = writable(0)
export const route     = writable(0)

async function update() {
  await manual

  let t = locate()

  if (t.path === path) {
    if (t.qs !== qs) {
      // Trigger a route update if the QS changes, even if the path is the same.
      route.update(r => {
        r.qs = t.qs
        return r
      })
    }

    return
  }

  path = t.path
  qs   = t.qs

  for (let spec of routes) {
    let params = match(spec.re, t.path, spec.keys)
    if (params) {
      let m = await spec.use(params)
      if (!m) return

      t.params = params

      route.set(t)
      component.set(m.default || m)
      // FIXME(alcore) Currently child modules that have their own routing could use
      // a means of notifying about 'load/render complete' states.
      // scroll(0, 0)

      return
    }
  }

  // If no route matches and this isn't already a redirection to 404, do that now.
  // We use a full redirect because we want the server to return a 404 status code, not just display an Error page.
  if (loc.pathname !== '/404') {
    loc.replace('/404')
    return
  }

  component.set(Error)
  route.set(t)
}

function compile(src) {
  const keys = []
  let
    h   = 0,
    res = ''

  for (let i = 0, n = src.length; i < n; i++) {
    const c = src[i]
    if (c !== ':') continue

    let j = i;
    for (; j < n; j++) {
      if (src[j] === '/') break
    }

    keys.push(src.slice(i + 1, j))
    res += src.slice(h, i) + '([^\\/]+)'

    h = i = j
  }

  return {
    re: new RegExp(`^${res || src}$`),
    keys
  }
}

function match(re, path, keys) {
  let match = path.match(re)
  if (!match) return

  let params = {}
  if (keys) {
    keys.forEach((key, i) => params[key] = match[i+1])
  }

  return params
}

async function load(thunk, p) {
  const target = loc.pathname

  let m         = await thunk
  if (m.init) m = await m.init(p) || m
  if (target  !== loc.pathname) return

  return m
}

const routes = [
  {path: '/games',       use: p => load(Games, p)},
  {path: '/games/:slug', use: p => load(Games, p)},
  {path: '/resources',   use: p => load(import('../../modules/resources/Index.svelte'), p)}
]

// Compile the routes and then trigger an update to catch the initial page load.
for (let route of routes) {
  const {re, keys} = compile(route.path)
  route.re   = re
  route.keys = keys
}

update()