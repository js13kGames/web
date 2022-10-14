{#if component}
  <svelte:component this={component} {entry} />
{/if}

<script>
  import { onMount } from 'svelte'

  import { edition }              from '../../core/state.js'
  import { route }                from '../../core/router/index.js'
  import api                      from '../../core/api.js'
  import { editions, categories } from '../../data/editions.js'

  import Index from './Index.svelte'
  import Entry from './Entry.svelte'

  let component, entry

  onMount(_ => route.subscribe(async r => {
    let slug = r.params.slug
    if (slug) {
      await api.get('g/' + slug)
        .then(response => response.json())
        .then(src => {
          // TODO(alcore) Might be too aggressive, as we're setting the edition for the entire site.
          // This is to cover direct traffic to the games, so that the /games index gets populated with games
          // from the same edition once/if the user chooses to go there.
          //
          // TODO(alcore) Index needs canonical URLs in its head for this to get indexed properly by bots without
          // duplicate content flags.
          edition.set(src.edition)

          // Convert the categories bitmask into actual display labels.
          const
            labels  = [],
            ed      = editions[src.edition]

          for (let i = 0; i < ed.c; i++) {
            if ((src.categories & (1 << i)) !== 0) {
              // Resolve the label.
              labels.push(categories[i])
            }
          }

          src.year       = (2012 + src.edition).toString()
          src.categories = labels.join(', ')
          src.slug       = slug // Server doesn't respond with the slug, but we need to pass it around further.
          src.comments   = src.comments || []
          src.play       = src.play || '//play.js13kgames.com/' + slug

          entry = src
        })

      component = Entry
    } else {
      let y = r.qs.get('y')
      if (y) {
        let i = parseInt(y) - 2012
        if (i < 0 || i >= editions.length) {
          location.replace('/404')
          return
        }

        edition.set(i)
      }

      component = Index
    }

    scroll(0, 0)
  }))
</script>