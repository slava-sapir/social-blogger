import React, { useRef } from 'react';
import './App.css'
import { Outlet } from "react-router-dom";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FlashMessage from './components/FlashMessage.jsx';
import { useApp } from './context/app-context.jsx'; // ✅ unified context
import Search from './components/Search.jsx'; // ✅ added Search component
import { CSSTransition } from 'react-transition-group';
const Chat = React.lazy(() => import('./components/Chat.jsx')); // ✅ lazy load Chat component
// import Chat from './components/Chat.jsx';
const App = () => {
  const { isSearchOpen, flashMessages, isLoggedIn }  = useApp();
  const searchRef = useRef(null);

  return (
    <>
    <FlashMessage messages={flashMessages} />
    <Header/>
      <Outlet />
    <CSSTransition nodeRef={searchRef} in={isSearchOpen} timeout={330} classNames="search-overlay" unmountOnExit>
      <div ref={searchRef} className='search-overlay'>
        <Search />
      </div>
    </CSSTransition>
    { isLoggedIn && <Chat/>}
    <Footer />
    </>
  )
};

export default App
