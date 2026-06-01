import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { queryClient } from './api/queryClient.ts'
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
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
