{#if comp}
  <div id=g-n class:dark={$dark}>
    <div class='f-ac l-c'>
      <a title='js13kGames' class='f-ac logo' href=/games>
        <svg><use href=#logo-mark /></svg>
        <span class=r-h-s>js<i>13k</i>Games</span>
      </a>
      {#if !$gaming}
        <nav class=f-ac>
          <a href=/games class:active={$route.path.startsWith('/games')}>Games</a>
        </nav>
      {:else}
        <div id=g-n-game class=f-ac>
          <h2>{$gaming}</h2>
          <i class=btn on:click={_ => gaming.set(0)}>Close ✖</i>
        </div>
      {/if}
    </div>
  </div>

  <svelte:component this={$component} />

  <footer id=g-f>
    <div class=l-g>
      <div class='f-ac logo'>
        <svg><use href=#logo-mark /></svg>
        js<i>13k</i>Games
      </div>

      <nav>
        <section class=f-col>
          <h2>Competition</h2>
          <a href=/games>Games</a>
          <a href=/ >Experts</a>
          <a href=/ >Partners</a>
          <a href=/ >Rules</a>
        </section>
        <section class=f-col>
          <h2>Community</h2>
          <a href=/resources>Resources</a>
          <a href=/ >Blog</a>
        </section>
        <section class=f-col>
          <h2>About us</h2>
          <a href=/ >History</a>
          <a href=/ >Team</a>
          <a href=/ >Press kit</a>
        </section>
      </nav>
    </div>
  </footer>

  <div id=g-legal class='l-c f-ac'>
    © 2022 js13kGames. All rights reserved.
    <div class=f>
      <a title='js13kGames on Twitter' href=//twitter.com/js13kGames><svg viewBox='0 0 24 24'><path d='M23.6 5c-.8.3-1.7.6-2.6.7A4.7 4.7 0 0 0 23 3a9.3 9.3 0 0 1-3 1.1 4.7 4.7 0 0 0-7.9 4.3 13.2 13.2 0 0 1-9.6-4.9c-.4.7-.6 1.5-.6 2.3a4.7 4.7 0 0 0 2 4 4.6 4.6 0 0 1-2-.7v.1a4.7 4.7 0 0 0 3.7 4.6 4.7 4.7 0 0 1-2.1 0 4.7 4.7 0 0 0 4.3 3.3 9.3 9.3 0 0 1-5.8 2 9.5 9.5 0 0 1-1 0 13.2 13.2 0 0 0 7 2A13.2 13.2 0 0 0 21.4 7.4a9.5 9.5 0 0 0 2.3-2.5z'/></svg></a>
      <a title='js13kGames on Slack' href=//join.slack.com/t/js13kgames/shared_invite/zt-1fvkerkye-xVSTyQG81pSsahBanLXU9Q><svg viewBox='0 0 24 24'><path d='M9 1a2.2 2.2 0 1 0 0 4.4h2.3V3.2A2.2 2.2 0 0 0 9 1zm0 5.9H3.3a2.2 2.2 0 0 0 0 4.4h5.9a2.2 2.2 0 1 0 0-4.4zM23 9a2.2 2.2 0 0 0-4.4 0v2.3h2.2A2.2 2.2 0 0 0 23 9zm-5.9 0V3.3a2.2 2.2 0 0 0-4.4 0v5.9a2.2 2.2 0 1 0 4.4 0zM15 23a2.2 2.2 0 1 0 0-4.4h-2.3v2.2c0 1.2 1 2.2 2.2 2.2zm0-5.9h5.8a2.2 2.2 0 0 0 0-4.4h-5.9a2.2 2.2 0 0 0 0 4.4zM1 15a2.2 2.2 0 0 0 4.4 0v-2.3H3.2A2.2 2.2 0 0 0 1 15zm5.9 0v5.8a2.2 2.2 0 0 0 4.4 0v-5.9a2.2 2.2 0 0 0-4.4 0z'/></svg></a>
      <a title='js13kGames on GitHub' href=//github.com/js13kGames><svg><use href=#i-gh /></svg></a>
      <a title='js13kGames on Facebook' href=//facebook.com/js13kGames><svg viewBox='0 0 24 24'><path d='M0 12c0 6 4.3 11 10 12v-8.7H7V12h3V9.3c0-3 2-4.6 4.7-4.6l2.6.2V8h-1.5c-1.5 0-1.8.7-1.8 1.7V12h3.2l-.5 3.3H14V24c5.7-1 10-6 10-12 0-6.6-5.4-12-12-12S0 5.4 0 12z'/></svg></a>
    </div>
  </div>
{/if}

<script>
import { tick }             from 'svelte'
import { component, route } from './core/router'
import { dark, gaming }     from './core/state.js'

let
  comp,
  io

component.subscribe(c => {
  comp = c

  if (c && !io) {
    tick().then(_ => {
      const
        el = document.getElementById('g-n'),
        io = new IntersectionObserver(
          ([e]) => e.target.classList.toggle('sticky', e.intersectionRatio < 1),
          {
            rootMargin: '-1px 0px 0px 0px',
            threshold: [1],
          }
        )

      io.observe(el)
    })
  }
})

</script>