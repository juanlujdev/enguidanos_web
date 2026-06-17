import React from 'react'
import { Hero, Marquee, Highlights, InteractiveMap, AgendaPreview, Gallery, News, Visit } from '../shared/index.js'

function Home({ setPage, navigate }) {
  return (
    <>
      <Hero setPage={setPage} />
      <Marquee />
      <Highlights setPage={setPage} navigate={navigate} />
      <InteractiveMap />
      <AgendaPreview setPage={setPage} />
      <Gallery />
      <News setPage={setPage} />
      <Visit setPage={setPage} />
    </>
  )
}

export default Home
