import { BrowserRouter  , createBrowserRouter, RouterProvider} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout.jsx";

const appRouter = createBrowserRouter([

  {
    path: "/",
    element:<MainLayout/>,
    children: [


      {
        path: "/",
        element: (
        <>
          <Home />
        </>
        ),
      },

      {
        path: "login",
        element: (
          <>
            <Login />
          </>
        ),
      }



      

    ]
  }

]);



function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
