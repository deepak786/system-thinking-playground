import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Seo } from './components/Seo'
import { About } from './pages/about/About'
import { Home } from './pages/Home'
import { demoRegistry } from './demos/demoRegistry'
import { demoPath, seriesSlugFor } from './demos/paths'
import type { DemoDefinition } from './demos/types'

function DemoPage({ demo }: { demo: DemoDefinition }) {
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
  const seriesDemos = demoRegistry.filter((d) => seriesSlugFor(d))
  const standaloneDemos = demoRegistry.filter((d) => !seriesSlugFor(d))

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />

          {standaloneDemos.map((demo) => (
            <Route
              key={demo.id}
              path={`/${demo.id}`}
              element={<DemoPage demo={demo} />}
            />
          ))}

          {seriesDemos.map((demo) => (
            <Route
              key={demo.id}
              path={demoPath(demo)}
              element={<DemoPage demo={demo} />}
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
