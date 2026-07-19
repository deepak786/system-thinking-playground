import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Seo } from './components/Seo'
import { About } from './pages/about/About'
import { Home } from './pages/Home'
import { SeriesHub } from './pages/SeriesHub'
import { demoRegistry } from './demos/demoRegistry'
import { demoPath, seriesPath } from './demos/paths'
import { isPlayable, isSeries } from './demos/types'
import type { PlayableDemo } from './demos/types'

function DemoPage({ demo }: { demo: PlayableDemo }) {
  return (
    <>
      <Seo
        title={demo.title}
        description={demo.metaDescription ?? demo.description}
        ogImage={demo.ogImage}
      />
      <demo.component />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />

          {demoRegistry.flatMap((entry) => {
            if (isSeries(entry)) {
              return [
                <Route
                  key={entry.id}
                  path={seriesPath(entry)}
                  element={<SeriesHub series={entry} />}
                />,
                ...entry.demos.filter(isPlayable).map((demo) => (
                  <Route
                    key={demo.id}
                    path={demoPath(demo)}
                    element={<DemoPage demo={demo} />}
                  />
                )),
              ]
            }

            if (isPlayable(entry)) {
              return [
                <Route
                  key={entry.id}
                  path={demoPath(entry)}
                  element={<DemoPage demo={entry} />}
                />,
              ]
            }

            return []
          })}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
