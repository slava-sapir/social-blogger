import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "";
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css'
import './index.css'
import App from './App.jsx';
import HomeRoute from './components/HomeRoute.jsx';
import About from './components/About.jsx';
import Terms from './components/Terms.jsx'; 
import CreatePost from './components/CreatePost.jsx';
import ViewSinglePost from './components/ViewSinglePost.jsx';
import { AppProvider } from './context/app-context.jsx';
import Profile from './components/Profile.jsx';
import EditPost from './components/EditPost.jsx';
import NotFound from './components/NotFound.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const router = createBrowserRouter(createRoutesFromElements(

  <Route path='/' element={<App />} >
     <Route index element={<HomeRoute />} />
     <Route path='/profile/:username/*' element={
      <PrivateRoute><Profile /></PrivateRoute>
      } />
     <Route path='/create-post' element={<CreatePost />} />
     <Route path='/post/:id' element={<ViewSinglePost />} />
     <Route path='/post/:id/edit' element={<EditPost />} />
     <Route path='/about' element={<About />} />
     <Route path='/terms' element={<Terms />} />
     <Route path='*' element={<NotFound />} />
  </Route>
));
 
const root = createRoot(document.getElementById('root'));

root.render(
   <AppProvider>
    <RouterProvider router={router} />
   </AppProvider>
);