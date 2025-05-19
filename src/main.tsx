import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { Login } from './pages/Login';
import { Eimerias } from './pages/Eimerias';
import { NewEimeria } from './pages/NewEimeria';
import { ViewEimeria } from './pages/ViewEimeria';
import { UpdateEimeria } from './pages/UpdateEimeria';
import { Glossary } from './pages/Glossary';
import { References } from './pages/References';
import { ScientificNames } from './pages/ScientificNames';
import { Accounts } from './pages/Accounts';
import { NewAccount } from './pages/NewAccount';
import { PrivateRoute } from './components/PrivateRoute';
import { Profile } from './pages/Profile';
import { ViewAccount } from './pages/ViewAccount';
import { EditAccount } from './pages/EditAccount';
import Dashboard from './pages/Dashboard';
import { SessionManager } from './components/SessionManager';
import { NotFound } from './pages/NotFound';

const router = createBrowserRouter([
  { path:'/', element: <Login/>},
  { path:'/dashboard', element: <PrivateRoute><Dashboard/></PrivateRoute>},
  { path:'/eimerias', element: <PrivateRoute><Eimerias/></PrivateRoute>},
  { path:'/nova-eimeria', element: <PrivateRoute><NewEimeria/></PrivateRoute>},
  { path:'/visualizar-eimeria', element: <PrivateRoute><ViewEimeria/></PrivateRoute>},
  { path:'/atualizar-eimeria', element: <PrivateRoute><UpdateEimeria/></PrivateRoute>},
  { path:'/glossario', element: <PrivateRoute><Glossary/></PrivateRoute>},
  { path:'/referencias', element: <PrivateRoute><References/></PrivateRoute>},
  { path:'/nomes-cientificos', element: <PrivateRoute><ScientificNames/></PrivateRoute>},
  { path:'/contas', element: <PrivateRoute requireAdmin><Accounts/></PrivateRoute>},
  { path:'/nova-conta', element: <PrivateRoute requireAdmin><NewAccount/></PrivateRoute>},
  { path:'/perfil', element: <PrivateRoute><Profile/></PrivateRoute>},
  { path:'/visualizando-conta', element: <PrivateRoute requireAdmin><ViewAccount/></PrivateRoute>},
  { path:'/editando-conta', element: <PrivateRoute requireAdmin><EditAccount/></PrivateRoute>},
  { path:'*', element: <NotFound/>}
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionManager />
    <RouterProvider router={router}/>
  </StrictMode>
)
