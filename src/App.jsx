
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardHome from './pages/Dashboard'
import Layout from './components/Layout';
import { useState } from 'react';
import PropertiesPage from './pages/Properties';
import DealersPage from './pages/Dealers';
import BannersPage from './pages/AddBanner';
import UsersPage from './pages/AddUsers';
import { AddDealerPage } from './pages/AddDealer';
import AdminLogin from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import PostPropertiesPage from './pages/PostProperties';

function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(false);

  const router= createBrowserRouter([
    {
      path:'/',
      element: <AdminLogin/>

    },

    {
      path:'admin',
       element: (
        <ProtectedRoute>
          <Layout isSidebarOpen={isSidebarOpen} setisSidebarOpen={setisSidebarOpen}/>
         </ProtectedRoute>
      ),

     children:[
      {
        path:'dashboard',
        element: <DashboardHome />
      },
      {
        path:'properties',
        element: <PropertiesPage />
      },
      {
        path:'dealers',
        element: <DealersPage />
      },
      {
        path:'add-banner',
        element: <BannersPage />
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
    ]

    }
  ])
 return <RouterProvider router={router} />;
}

export default App
