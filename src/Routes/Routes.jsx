import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AllScholarship from "../Pages/Scholarship/AllScholarship";
import DashboardLayout from "../Layout/DashboardLayout";
import MyProfile from "../Pages/UserDashboard/MyProfile/MyProfile";
import AuthLayout from "../Layout/AuthLayout";
import RegisterForm from "../Pages/Authentication/RegisterForm";
import LoginForm from "../Pages/Authentication/LoginForm";
import ModeratorDashboardLayout from "../Layout/ModeratorDashboardLayout";
import ModeratorMyProfile from "../ModeratorDashboard/ModeratorMyProfile/ModeratorMyProfile";
import ManageScholarships from "../ModeratorDashboard/ManageScholarships/ManageScholarships";
import AllReviews from "../ModeratorDashboard/AllReviews/AllReviews";
import AllAppliedScholarship from "../ModeratorDashboard/AllAppliedScholarship/AllAppliedScholarship";
import AddScholarship from "../ModeratorDashboard/AddScholarship/AddScholarship";
import ScholarshipDetails from "../Pages/Scholarship/ScholarshipDetails";
import PrivateRoute from "./PrivateRoute";
import Payment from "../Payment/Payment";
import MyApplication from "../Pages/UserDashboard/MyApplication/MyApplication";
import MyReviews from "../Pages/UserDashboard/MyReviews/MyReviews";
import MyApplicationDetails from "../Pages/UserDashboard/MyApplication/MyApplicationDetails";
import AdminLayout from "../Layout/AdminLayout";
import AdminMyProfile from "../Pages/AdminDashboard/AdminMyProfile/AdminMyProfile";
import AdminAddScholarship from "../Pages/AdminDashboard/AdminAddScholarship/AdminAddScholarship";
import AdminManageScholarship from "../Pages/AdminDashboard/AdminManageScholarship/AdminManageScholarship";
import AdminManageAppliedApplication from "../Pages/AdminDashboard/AdminManageAppliedApplication/AdminManageAppliedApplication";
import AdminManageUser from "../Pages/AdminDashboard/AdminManageUser/AdminManageUser";
import AdminManageReview from "../Pages/AdminDashboard/AdminManageReview/AdminManageReview";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import ModeratorRoute from "./ModeratorRoute";
import UserRoute from "./UserRoute";
import Error from "../Pages/Error/Error";
import AdminAnalyticsChart from "../Pages/AdminDashboard/AdminAnalyticsChart/AdminAnalyticsChart";
import AllScholarship2 from "../Pages/Scholarship/AllScholarship2";

export const router = createBrowserRouter([
  {
    path: "/*",
    element: <Error></Error>
  },
  {
          path: '/forbidden',
          element: <Forbidden></Forbidden>
  },
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
        {
            index: true,
            element: <Home></Home>
        },
        {
            path: '/allScholarship',
            element: <AllScholarship></AllScholarship>
        },
        {
          path: "/scholarship/:id", 
          element: <PrivateRoute><ScholarshipDetails></ScholarshipDetails></PrivateRoute>
        },
        {
          path: "/payment/:id",
          element: <PrivateRoute><Payment></Payment></PrivateRoute>
        },
    ]
  },
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/login",
        element: <LoginForm></LoginForm>,
      },
      {
        path: "/register",
        element: <RegisterForm></RegisterForm>
      }
    ]
  },
  {
    path: '/userDashboard',
    element: <UserRoute><PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute></UserRoute>,
    children: [
      {
        index: true,
        element: <UserRoute><PrivateRoute><AllScholarship2></AllScholarship2></PrivateRoute></UserRoute>
      },
        {
            path: 'myProfile',
            element: <UserRoute><PrivateRoute><MyProfile></MyProfile></PrivateRoute></UserRoute>
        },
        {
          path: 'myApplication',
          element: <UserRoute><PrivateRoute><MyApplication></MyApplication></PrivateRoute></UserRoute> 
        },
        {
          path: 'myApplication/details/:id',
          element: <UserRoute><PrivateRoute><MyApplicationDetails></MyApplicationDetails></PrivateRoute></UserRoute>
        },
        {
          path: 'myReviews',
          element: <UserRoute><PrivateRoute><MyReviews></MyReviews></PrivateRoute></UserRoute> 
        }
    ]
  },
  {
    path: '/moderatorDashboard',
    element: <ModeratorRoute><PrivateRoute><ModeratorDashboardLayout></ModeratorDashboardLayout></PrivateRoute></ModeratorRoute>,
    children: [
      {
        index: true,
        element: <ModeratorRoute><PrivateRoute><AdminAnalyticsChart></AdminAnalyticsChart></PrivateRoute></ModeratorRoute>
      },
        {
            path: 'moderatorMyProfile',
            element: <ModeratorRoute><PrivateRoute><ModeratorMyProfile></ModeratorMyProfile></PrivateRoute></ModeratorRoute>
        },
        {
          path: 'manageScholarships',
          element: <ModeratorRoute><PrivateRoute><ManageScholarships></ManageScholarships></PrivateRoute></ModeratorRoute>
        },
        {
          path: 'allReviews',
          element: <ModeratorRoute><PrivateRoute><AllReviews></AllReviews></PrivateRoute></ModeratorRoute>
        },
        {
          path: 'allAppliedScholarships',
          element: <ModeratorRoute><PrivateRoute><AllAppliedScholarship></AllAppliedScholarship></PrivateRoute></ModeratorRoute>
        },
        {
          path: 'addScholarship',
          element: <ModeratorRoute><PrivateRoute><AddScholarship></AddScholarship></PrivateRoute></ModeratorRoute>
        }
    ]
  },
  {
    path: '/adminDashboard',
    element: <AdminRoute><PrivateRoute><AdminLayout></AdminLayout></PrivateRoute></AdminRoute>,
    children: [
      {
        index: true,
        element: <AdminRoute><PrivateRoute><AdminAnalyticsChart></AdminAnalyticsChart></PrivateRoute></AdminRoute>
      },
      {
        path: 'adminMyProfile',
        element: <AdminRoute><PrivateRoute><AdminMyProfile></AdminMyProfile></PrivateRoute></AdminRoute>
      },
      {
        path: 'adminAddScholarship',
        element: <AdminRoute><PrivateRoute><AdminAddScholarship></AdminAddScholarship></PrivateRoute></AdminRoute>
      },
      {
        path: "analytics",
        element: <AdminRoute><PrivateRoute><AdminAnalyticsChart></AdminAnalyticsChart></PrivateRoute></AdminRoute>
      },
      {
        path: 'adminManageScholarship',
        element: <AdminRoute><PrivateRoute><AdminManageScholarship></AdminManageScholarship></PrivateRoute></AdminRoute>
      },
      {
        path: 'adminManageAppliedApplication',
        element: <AdminRoute><PrivateRoute><AdminManageAppliedApplication></AdminManageAppliedApplication></PrivateRoute></AdminRoute>
      },
      {
        path: 'adminManageUser',
        element: <AdminRoute><AdminRoute><PrivateRoute><AdminManageUser></AdminManageUser></PrivateRoute></AdminRoute></AdminRoute>
      },
      {
        path: 'adminManageReview',
        element: <AdminRoute><PrivateRoute><AdminManageReview></AdminManageReview></PrivateRoute></AdminRoute>
      },
    ]
  }
]);