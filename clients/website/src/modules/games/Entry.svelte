<svelte:head>
  <title>{entry.name} | js13kGames</title>
  <meta name=description content='A game in the js13kGames {entry.year} competition. Play it now!' />
</svelte:head>

<header id=p-h class=dark>
  <div class=l-g>
    <div id=m-g-v-head>
      <span>
        <a href=/games>Games<small>{entry.year}</small></a>
      </span>
      <h1>{entry.name}</h1>

      <a href={entry.play} class=btn on:click|preventDefault={play} class:loading>
        <em>Play now</em>
        <small class=f-ac>{#if loading}Loading{/if}<svg><use href=#logo-mark /></svg></small>
      </a>

      {#if played}
        <div class=fallback>
          If something isn't working quite right, try opening the game in a new tab.
        </div>
      {/if}

      <dl id=m-g-v-meta>
        <div>
          <dt>Author</dt>
          <dd class=f-ac>
            {#if entry.homepage}
              <a href={entry.homepage}>
                {entry.author}
              </a>
              <svg class=stroke viewBox='0 0 24 24'><path d='M13.5 10.5 21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5'/></svg>
            {:else}
              {entry.author}
            {/if}
          </dd>
        </div>

        <div>
          <dt>Code</dt>
          <dd class=f-ac>
            <a href=//github.com/js13kGames/{entry.slug} class=repo>Source</a>
            <svg><use href=#i-gh /></svg>
          </dd>
        </div>

        <div>
          <dt>Categories</dt>
          <dd>{entry.categories}</dd>
        </div>
      </dl>
    </div>
    <div id=m-g-v-img class=f-c>
      <img id=m-g-v-img-backdrop width=400 height=250 alt src=//play.js13kgames.com/{entry.slug}/__big.jpg>
      <img id=m-g-v-img-front width=400 height=250 alt={entry.name} src=//play.js13kgames.com/{entry.slug}/__big.jpg>
    </div>
  </div>
</header>

<main id=m-g-v>
  <section id=m-g-v-desc class=l-g>
    {entry.description}
  </section>

  {#if entry.comments.length}
    <section id=m-g-v-feedback class=l-c>
      <h2 class=f-ac>Feedback</h2>

      {#each entry.comments as c}
        <figure class:expert={c.expert} class=f-col>
          <blockquote>
            {@html c.text}
          </blockquote>
          <figcaption>
            {#if c.expert}
              <small class=label>Expert</small>{c.author}
            {:else}
              <a href=//github.com/{c.author}>{c.author}</a>
            {/if}
          </figcaption>
        </figure>
      {/each}
    </section>
  {/if}
</main>

<script>
  import { onMount, tick } from 'svelte'
  import { route }         from '../../core/router/index.js'
  import { dark, gaming }  from '../../core/state.js'

  export let entry

  let
    played, loading, gameEl,

    // TODO(alcore) Use the Screen Orientation API once Safari properly supports it.
    orientation = window.matchMedia("(orientation: portrait)")

  onMount(_ => route.subscribe(_ => gaming.set(0)))
  onMount(_ => gaming.subscribe(t => {
    if (!gameEl) return

    const s = gameEl.style

    if (t) {
      loading = false

      s.transition = 'opacity .5s, height .5s'
      s.opacity    = null
      s.position   = null

      tick().then(_ => {
        gameEl.scrollIntoView({behavior: 'smooth'})
        gameEl.focus()
      })
    } else {
      document.body.style.overflow = null

      s.height  = 0
      s.opacity = 0

      scroll({top: 0, behavior: 'smooth'})
      setTimeout(_ => {
        if (gameEl) gameEl.remove()
      }, 400)
    }
  }))

  onMount(_ => {
    $dark = 1
    orientation.addEventListener('change', handleOrientationChange)

    return _ => {
      $dark = 0
      orientation.removeEventListener('change', handleOrientationChange)
    }
  })

  function handleOrientationChange() {
    if (gameEl) gameEl.scrollIntoView()
  }

  function play() {
    if (loading) return

    if (entry.categories.indexOf('Decentralized') !== -1) {
      open(entry.play, '_blank').focus()
      return
    }

    // TODO(alcore) Might be too aggressive, but if a scroll is in progress while
    // we scrollIntoView, the browser will stop halfway through and lock the scroll
    // with an only partially visible iframe.
    document.body.style.overflow = 'hidden'

    played         = true
    loading        = true
    gameEl         = document.createElement('iframe')
    gameEl.allow   = 'accelerometer *;ambient-light-sensor *;autoplay *;battery *;camera *;display-capture *;encrypted-media *;fullscreen *;gamepad *;geolocation *;gyroscope *;magnetometer *;microphone *;midi *;monetization *;payment *;picture-in-picture *;publickey-credentials-get *;speaker-selection *;sync-xhr *;usb *;web-share *;xr-spatial-tracking *'
    gameEl.src     = entry.play
    gameEl.onload  = _ => {gaming.set(entry.name)}

    gameEl.style.opacity  = 0
    gameEl.style.position = 'absolute'

    document.getElementById('m-g-v').prepend(gameEl)
  }
</script>