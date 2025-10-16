import { useApp } from '../context/app-context.jsx'; // ✅ unified context
import Home from './Home.jsx';
import HomeGuest from './HomeGuest.jsx';

const HomeRoute = () => {
  const { isLoggedIn } = useApp();

  return isLoggedIn ? <Home /> : <HomeGuest />
}

export default HomeRoute;
