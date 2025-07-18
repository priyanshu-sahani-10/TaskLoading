import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout.jsx";
import ReportIssue from "./pages/user/ReportIssue.jsx";
import CommunityBoard from "./pages/CommunityIssues.jsx";
import UserIssues from "./pages/user/UserIssues.jsx";
import AdminIssueManager from "./pages/admin/AdminIssuesManager.jsx";
import SingleIssue from "./pages/SingleIssue.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
        path: "/login",
        element: (
          <>
            <Login />
          </>
        ),
      },

      {
        path: "reportIssue",
        element: (
          <>
            <ReportIssue />
          </>
        ),
      },

      {
  path: "/communityBoard",
  element: <CommunityBoard />,
},
{
  path: "/communityBoard/getIssue/:issueId",
  element: <SingleIssue />,
},


      {
        path: "userIssues",
        element: (
          <>
            <UserIssues />
          </>
        ),
      },

      {
        path: "adminIssuesManager",
        element: (
          <>
            <AdminIssueManager />
          </>
        ),
      },
    ],
  },
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
