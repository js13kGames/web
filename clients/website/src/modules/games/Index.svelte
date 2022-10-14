<svelte:head>
  <title>{year} | Games | js13kGames</title>
  <meta name=description content='Check out the games from the {year} edition of the js13kGames competition and play them for free.' />
</svelte:head>

<header id=p-h>
  <div class=l-c>
    <span>Games</span>
    <h1>Entire game worlds<br>in &leq;13 kilobytes</h1>
  </div>
</header>

<div id=m-g-opts>
  <div class='l-c f-ac'>

    <div id=m-g-opts-cat class='f-ac opt' on:click={handleCategorySelectorClick}>
      <span>Categories ▼</span>
      <b>
        {$cats === 255
          ? 'All'
          : 'Filtered'
        }
        <small class=label>{ filtered.length }</small>
      </b>

      <div id=m-g-opts-cat-selector class=f class:active={categoriesShow}>
        {#each Array(editions[$edition].c) as _, i}
          {@const checked = ($cats & (1 << i)) !== 0}
          {#key checked}
            <label on:click={_ => toggleCategory(i)}>
              <b class:checked>{categories[i]}</b>
              <input type=checkbox {checked} />
            </label>
          {/key}
        {/each}
      </div>
    </div>
  </div>
</div>

<main id=m-g class=l-c>
  {#each filtered as entry}
    <a href=/games/{entry.s}>
      <img width=160 height=160 alt={entry.t} src=//play.js13kgames.com/{entry.s}/__small.jpg loading=lazy>
      <h2>{entry.t}</h2>
      <address>{entry.a}</address>
    </a>
  {/each}
</main>

<script>
  import { onMount }              from 'svelte'

  import api                      from '../../core/api.js'
  import { edition }              from '../../core/state.js'
  import { editions, categories } from '../../data/editions.js'
  import { cats }                 from './state.js'
  import { slugify }              from './utils.js'

  let
    categoriesShow,
    entries  = [],
    filtered = []

  $: year = (2012 + $edition).toString()

  onMount(_ => {
    document.addEventListener('click', handleDocumentClick)

    return _ => document.removeEventListener('click', handleDocumentClick)
  })

  onMount(_ => edition.subscribe(async e => {
    let
      dst     = [],
      edition = editions[e]

    if (!edition.g) {
      let
        buf  = await (await api.get('g:' + e)).arrayBuffer(),
        utf8 = new TextDecoder(),
        src  = new Uint8Array(buf),
        i    = 0,
        j    = 0,
        c, n, a, t

      // let counts = new DataView(await (await counters).arrayBuffer())

      while (j < src.length) {
        c = src[j]; j++

        // The first byte denotes the categories. If it's a null, we hit a soft deleted entry that we should omit.
        if (c === 0) {
          i++; continue
        }

        // Title, length-prefixed UTF-8.
        n = src[j]; j++
        t = utf8.decode(new Uint8Array(buf, j, n)); j += n

        // Author, length-prefixed UTF-8.
        n = src[j]; j++
        a = utf8.decode(new Uint8Array(buf, j, n)); j += n

        dst.push({
          i,
          c,
          t,
          a,
          // v,
          s: slugify(t)
        })

        i++
      }

      edition.g = dst
    }

    // Let Svelte do its thing.
    entries = edition.g

    update()
  }))

  function update() {
    if (!entries.length) return

    if ($cats) {
      // TODO(alcore) We could index entries in their categories on fetch instead of going linearly each time
      // a category gets selected.
      let dst = []
      for (let i = 0; i < entries.length; i++) {
        const item = entries[i]
        if (($cats & item.c) !== 0) {
          dst.push(item)
        }
      }

      filtered = dst
    } else {
      filtered = entries
    }
  }

  function handleCategorySelectorClick(e) {
    e.stopPropagation()

    // If it's not a click on a child option, toggle the entire dropdown.
    if (!e.target.closest('label')) categoriesShow = !categoriesShow
  }

  function handleDocumentClick() {
    // Actual dropdown handler takes care of stopping propagation, so this does the trick
    // of simply hiding in each other case.
    categoriesShow = 0
  }

  function toggleCategory(idx) {
    $cats ^= (1 << idx)
    update()
  }
</script>