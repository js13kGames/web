<svelte:head>
  <title>Resources | js13kGames</title>
  <meta name=description content='Tools, assets and tutorials for creating js13kGames' />
</svelte:head>

<header id=p-h>
  <div class=l-c>
    <span>Resources</span>
    <h1>Tools, assets and tutorials for creating js13kGames</h1>
  </div>
</header>

<main id=m-r class=l-g>
  <div bind:this={root}>
    <Content />
  </div>
  <div id=p-side>
    <a href=//github.com/js13kGames/resources/edit/main/README.md class=btn style='margin-bottom:30px'>
      Edit this page
      <svg><use href=#i-gh /></svg>
    </a>
    <nav id=p-toc class=f-col>
      {#each toc as {h, t}, i}
        <a href={h} class:active={section === i}>{t}</a>
      {/each}
    </nav>
  </div>
</main>

<script>
  import { onMount } from 'svelte'

  import Content from './content/README.md'

  let
    root,
    toc = [],
    section

  onMount(_ => {
    const h = location.hash
    if (h[0] === '#') {
      let el = document.getElementById(h.slice(1))
      if (el) el.scrollIntoView()
    }

    for (let el of root.querySelectorAll('h2')) {
      toc.push({
        y: el.getBoundingClientRect().top + scrollY,
        t: el.innerText,
        h: el.firstChild.hash,
      })
    }

    toc = toc // Let Svelte do its thing.

    addEventListener('scroll', update)
    addEventListener('resize', update)
    update()

    return _ => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  })

  // TODO(alcore) Could theoretically use an IntersectionObserver here, since unlike on the blog
  // we're not updating a progress bar here, i.e. we can offload that work.
  function update() {
    const p = scrollY + innerHeight / 4

    for (let i = 0; i < toc.length; i++) {
      if (p < toc[i].y) {
        section = i - 1
        break
      }

      section = i
    }
  }

</script>