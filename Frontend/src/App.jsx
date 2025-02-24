import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Sign_in from "./pages/Sign_in"
import Home from "./pages/Home"
import Sign_up from "./pages/Sign_up"

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
      path:'/community',
      element: <Community/>,
    },
    {
      path:'/feed',
      element: <Feed/>,
    },
    {
      path:'/events',
      element: <Events/>,
    }
  ])
  return <RouterProvider router={router}/>;
}

export default App
