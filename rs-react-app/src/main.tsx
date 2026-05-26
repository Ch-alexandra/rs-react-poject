import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Layout } from './components/Layout.tsx'
import { DetailPanel } from './components/DetailPanel.tsx'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/404.tsx'
import { ThemeProvider } from './context/ThemeProvider'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { path: 'details/:id', element: <DetailPanel /> },
        ],
      },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)
