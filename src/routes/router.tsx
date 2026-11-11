import ContactPage from '@/pages/public/ContactPage'
import HomePage from '@/pages/public/HomePage'
import {createBrowserRouter} from 'react-router'

const router = createBrowserRouter([
    {
        path:"/", Component:HomePage
    },
    {
        path:"contact", Component:ContactPage
    }
])

export default router