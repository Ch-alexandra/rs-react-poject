import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'
import { Layout } from './components/Layout.tsx'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/404.tsx'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
