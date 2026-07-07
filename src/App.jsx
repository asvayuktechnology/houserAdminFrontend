
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardHome from './pages/Dashboard'
import Layout from './components/Layout';
import { useState } from 'react';
import PropertiesPage from './pages/Properties';
import DealersPage from './pages/Dealers';
import LeadsPage from './pages/Leads';
import { AddLeadPage } from './pages/AddLead';
import PostsPage from './pages/Posts';
import { AddPostPage } from './pages/AddPost';
import BannersPage from './pages/AddBanner';
import UsersPage from './pages/AddUsers';
import { AddDealerPage } from './pages/AddDealer';
import AdminLogin from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import PostPropertiesPage from './pages/PostProperties';
import LeadPropertiesPage from './pages/LeadProperties';
import SettingsPage from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {


  const router= createBrowserRouter([
    {
      path:'/',
      element: <AdminLogin/>

    },

    {
      path:'admin',
       element: (
        <ProtectedRoute>
          <Layout />
         </ProtectedRoute>
      ),

     children:[
      {
        path:'dashboard',
        element: <DashboardHome />
      },
      {
        path:'lead-properties',
        element: <LeadPropertiesPage />
      },
      {
        path:'dealers',
        element: <DealersPage />
      },
      {
        path:'leads',
        element: <LeadsPage />
      },
      {
        path:'add-lead',
        element: <AddLeadPage />
      },
      {
        path:'posts',
        element: <PostsPage />
      },
      {
        path:'add-post',
        element: <AddPostPage />
      },
      {
        path:'add-banner',
        element: <BannersPage />
      },
        {
        path:'properties',
        element: <PropertiesPage />
      },
      
      {
        path:'add-user',
        element: <UsersPage />
      },
      {
        path:'add-dealer',
        element: <AddDealerPage />
      },
      {
        path:'post-properties',
        element: <PostPropertiesPage />
      },
      {
        path:'settings',
        element: <SettingsPage />
      },
    ]

    },

    {
      path: "*",
      element: <NotFound />
    }
  ])
 return <RouterProvider router={router} />;
}

export default App
