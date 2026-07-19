import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Seo } from './components/Seo'
import { About } from './pages/about/About'
import { Home } from './pages/Home'
import { demoRegistry } from './demos/demoRegistry'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          {demoRegistry.map((demo) => (
            <Route
              key={demo.id}
              path={`/${demo.id}`}
              element={
                <>
                  <Seo
                    title={demo.title}
                    description={demo.metaDescription ?? demo.description}
                    ogImage={demo.ogImage}
                  />
                  <demo.component />
                </>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
