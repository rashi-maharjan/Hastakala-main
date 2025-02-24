import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Sign_in from './pages/Sign_in.jsx'
import Sign_up from './pages/Sign_up.jsx'
import Header from './components/Header.jsx'
import Events from './pages/Events.jsx'
import Button from './components/Button.jsx'
import Community from './pages/Community.jsx'
import Cart from './pages/Cart.jsx'
import Add_Events from './pages/Add_Events.jsx'
import ArtistPortfolio from './pages/ArtistPortfolio.jsx'
import Home from './pages/Home.jsx'
import Feed from './pages/Feed.jsx'
import Details from './pages/Details.jsx'
import Add_Products from './pages/Add_Products.jsx'
import Add_Posts from './pages/Add_Posts.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>,
    },
    {
      path:'/signin',
      element: <Sign_in/>,
    },
    {
      path:'/signup',
      element:<Sign_up/>
    },
    {
      path:'/feed',
      element: <Feed/>,
    },
    {
      path:'/community',
      element: <Community/>,
    },
    {
      path:'/add_posts',
      element: <Add_Posts/>,
    },
    {
      path:'/events',
      element: <Events/>,
    },
    {
      path: '/add_events',
      element:<Add_Events/>
    },
    {
      path:'/add_products',
      element: <Add_Products/>,
    },
    {
      path:'/artistportfolio',
      element: <ArtistPortfolio/>,
    },
    {
      path:'/cart',
      element: <Cart/>,
    },
    {
      path:'/details',
      element: <Details/>,
    }
  ])
  return <RouterProvider router={router}/>;
}

export default App
