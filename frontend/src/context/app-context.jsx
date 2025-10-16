// // src/context/app-context.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const AppContext = createContext();

const initialState = {
  user: null,
  isLoggedIn: false,
  flashMessages: [],
  isSearchOpen: false,
  isChatOpen: false,
  unreadChatCount: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // set user AND isLoggedIn
      return { ...state, user: action.payload, isLoggedIn: true };

    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };

    case 'ADD_FLASH':
      const newMessage = {
        id: uuidv4(),
        text: action.payload,
        type: action.msgType || 'success'
      };
      return { ...state, flashMessages: [...state.flashMessages, newMessage] };

    case 'REMOVE_FLASH':
      return {
        ...state,
        flashMessages: state.flashMessages.filter(msg => msg.id !== action.id)
      };

    case 'OPEN_SEARCH':
      return { ...state, isSearchOpen: true };

    case 'CLOSE_SEARCH':
      return { ...state, isSearchOpen: false };

    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };

    case 'CLOSE_CHAT':
      return { ...state, isChatOpen: false };

    case 'SET_UNREAD_CHAT_COUNT':
      return { ...state, unreadChatCount: state.unreadChatCount + 1 };

    case 'RESET_UNREAD_CHAT_COUNT':
      return { ...state, unreadChatCount: 0 };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Stabilize functions so effect deps are safe
  const login = useCallback(({ token, username, avatar }) => {
    localStorage.setItem('complexappToken', token);
    localStorage.setItem('complexappUsername', username);
    localStorage.setItem('complexappAvatar', avatar);

    dispatch({ type: 'LOGIN', payload: { token, username, avatar } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('complexappToken');
    localStorage.removeItem('complexappUsername');
    localStorage.removeItem('complexappAvatar');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const addFlashMessage = useCallback((text, msgType = 'success') => {
    // reuse existing reducer action for adding flash message
    dispatch({ type: 'ADD_FLASH', payload: text, msgType });
  }, []);

  const openSearch = useCallback(() => dispatch({ type: 'OPEN_SEARCH' }), []);
  const closeSearch = useCallback(() => dispatch({ type: 'CLOSE_SEARCH' }), []);
  const toggleChat = useCallback(() => dispatch({ type: 'TOGGLE_CHAT' }), []);
  const closeChat = useCallback(() => dispatch({ type: 'CLOSE_CHAT' }), []);
  const setChatCount = useCallback(() => dispatch({ type: 'SET_UNREAD_CHAT_COUNT' }), []);
  const resetChatCount = useCallback(() => dispatch({ type: 'RESET_UNREAD_CHAT_COUNT' }), []);


  // Token check: run when user.token exists (initial load + whenever token changes),
  // and poll periodically (optional).
  useEffect(() => {
    // only run when there is a token
    if (!state.user?.token) return;

    let isMounted = true;
    const source = axios.CancelToken.source();

    const checkTokenOnce = async () => {
      try {
        const response = await axios.post(
          '/checkToken',
          { token: state.user.token },
          { cancelToken: source.token }
        );

        if (isMounted && !response.data) {
          // token invalid/expired
          logout();
          addFlashMessage('Your session has expired. Please sign in again.', 'info');
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          // ignore cancellation
        } else {
          console.error('Token check failed:', err);
        }
      }
    };

    // initial check
    checkTokenOnce();

    // periodic check every 5 minutes (adjust if needed)
    const intervalId = setInterval(checkTokenOnce, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      source.cancel('token-check cleanup');
      clearInterval(intervalId);
    };
  }, [state.user?.token]);

  // restore from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('complexappToken');
    const username = localStorage.getItem('complexappUsername');
    const avatar = localStorage.getItem('complexappAvatar');

    if (token && username && avatar) {
      dispatch({
        type: 'LOGIN',
        payload: { token, username, avatar }
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user: state.user,
        isLoggedIn: !!state.user,
        login,
        logout,
        flashMessages: state.flashMessages,
        addFlashMessage,
        isSearchOpen: state.isSearchOpen,
        openSearch,
        closeSearch,
        isChatOpen: state.isChatOpen,
        toggleChat,
        closeChat,
        unreadChatCount: state.unreadChatCount,
        setChatCount,
        resetChatCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

// import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';

// const AppContext = createContext();

// const initialState = {
//   user: null,
//   isLoggedIn: false,
//   flashMessages: [],
//   isSearchOpen: false,
//   isChatOpen: false,
//   unreadChatCount: 0
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return { ...state, user: action.payload, isLoggedIn: true };

//     case 'LOGOUT':
//       return { ...state, user: null, isLoggedIn: false };

//     case 'ADD_FLASH':
//       const newMessage = {
//         id: uuidv4(),
//         text: action.payload,
//         type: action.msgType || 'success'
//       };
//       return { ...state, flashMessages: [...state.flashMessages, newMessage] };

//     case 'REMOVE_FLASH':
//       return {
//         ...state,
//         flashMessages: state.flashMessages.filter(msg => msg.id !== action.id)
//       };

//     case 'OPEN_SEARCH':
//       return { ...state, isSearchOpen: true };

//     case 'CLOSE_SEARCH':
//       return { ...state, isSearchOpen: false };

//     case 'TOGGLE_CHAT':
//       return { ...state, isChatOpen: !state.isChatOpen };

//     case 'CLOSE_CHAT':
//       return { ...state, isChatOpen: false };

//     case 'SET_UNREAD_CHAT_COUNT':
//       return { ...state, unreadChatCount: state.unreadChatCount + 1 };

//     case 'RESET_UNREAD_CHAT_COUNT':
//       return { ...state, unreadChatCount: 0 };

//     default:
//       return state;
//   }
// };

// // lazy init from localStorage so app has token synchronously on first render
// const init = () => {
//   const token = localStorage.getItem('complexappToken');
//   const username = localStorage.getItem('complexappUsername');
//   const avatar = localStorage.getItem('complexappAvatar');

//   if (token && username && avatar) {
//     return {
//       ...initialState,
//       user: { token, username, avatar },
//       isLoggedIn: true
//     };
//   }
//   return initialState;
// };

// export const AppProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, undefined, init);

//   // stable action creators
//   const login = useCallback(({ token, username, avatar }) => {
//     localStorage.setItem('complexappToken', token);
//     localStorage.setItem('complexappUsername', username);
//     localStorage.setItem('complexappAvatar', avatar);

//     dispatch({ type: 'LOGIN', payload: { token, username, avatar } });
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem('complexappToken');
//     localStorage.removeItem('complexappUsername');
//     localStorage.removeItem('complexappAvatar');

//     dispatch({ type: 'LOGOUT' });
//   }, []);

//   const addFlashMessage = useCallback((text, msgType = 'success') => {
//     dispatch({ type: 'ADD_FLASH', payload: text, msgType });
//   }, []);

//   const openSearch = useCallback(() => dispatch({ type: 'OPEN_SEARCH' }), []);
//   const closeSearch = useCallback(() => dispatch({ type: 'CLOSE_SEARCH' }), []);
//   const toggleChat = useCallback(() => dispatch({ type: 'TOGGLE_CHAT' }), []);
//   const closeChat = useCallback(() => dispatch({ type: 'CLOSE_CHAT' }), []);
//   const setChatCount = useCallback(() => dispatch({ type: 'SET_UNREAD_CHAT_COUNT' }), []);
//   const resetChatCount = useCallback(() => dispatch({ type: 'RESET_UNREAD_CHAT_COUNT' }), []);

//   // AXIOS INTERCEPTORS: attach token to requests and auto-refresh on 401
//   useEffect(() => {
//     // Request interceptor: attach Bearer token from current state
//     const reqI = axios.interceptors.request.use((config) => {
//       if (state.user?.token) {
//         config.headers = config.headers || {};
//         config.headers['Authorization'] = `Bearer ${state.user.token}`;
//       } else if (config.headers && config.headers['Authorization']) {
//         // remove header if no token
//         delete config.headers['Authorization'];
//       }
//       return config;
//     });

//     // Response interceptor: try refresh once on 401
//     const resI = axios.interceptors.response.use(
//       (res) => res,
//       async (err) => {
//         const original = err.config;

//         // if refresh endpoint itself failed, don't try to refresh again
//         if (original && original.url && original.url.includes('/refreshToken')) {
//           return Promise.reject(err);
//         }

//         if (err.response?.status === 401 && state.isLoggedIn && !original?._retry) {
//           original._retry = true;
//           try {
//             // NOTE: if you store refresh token in httpOnly cookie, ensure axios sends credentials:
//             // axios.defaults.withCredentials = true (set this in main.jsx) or pass { withCredentials: true } here.
//             const refreshResp = await axios.post('/refreshToken');

//             if (refreshResp.data?.token) {
//               // update context with new token
//               login({
//                 token: refreshResp.data.token,
//                 username: refreshResp.data.username ?? state.user.username,
//                 avatar: refreshResp.data.avatar ?? state.user.avatar
//               });

//               // retry the original request with new token
//               original.headers = original.headers || {};
//               original.headers['Authorization'] = `Bearer ${refreshResp.data.token}`;
//               return axios(original);
//             } else {
//               // refresh didn't return a token -> force logout
//               logout();
//               addFlashMessage('Session expired — please sign in again.', 'info');
//             }
//           } catch (refreshErr) {
//             // refresh failed: logout
//             logout();
//             addFlashMessage('Session expired — please sign in again.', 'info');
//             return Promise.reject(refreshErr);
//           }
//         }

//         return Promise.reject(err);
//       }
//     );

//     return () => {
//       axios.interceptors.request.eject(reqI);
//       axios.interceptors.response.eject(resI);
//     };
//   }, [state.user?.token, state.isLoggedIn, login, logout, addFlashMessage]);

//   // optional: a small single run check (not required with refresh interceptor; kept as extra safety)
//   useEffect(() => {
//     if (!state.user?.token) return;
//     const source = axios.CancelToken.source();
//     let mounted = true;

//     (async () => {
//       try {
//         const resp = await axios.post('/checkToken', { token: state.user.token }, { cancelToken: source.token });
//         if (mounted && !resp.data) {
//           logout();
//           addFlashMessage('Your session has expired. Please sign in again.', 'info');
//         }
//       } catch (e) {
//         if (!axios.isCancel(e)) console.error('checkToken error', e);
//       }
//     })();

//     return () => {
//       mounted = false;
//       source.cancel('cleanup');
//     };
//   }, [state.user?.token, logout, addFlashMessage]);

//   return (
//     <AppContext.Provider
//       value={{
//         user: state.user,
//         isLoggedIn: !!state.user,
//         login,
//         logout,
//         flashMessages: state.flashMessages,
//         addFlashMessage,
//         isSearchOpen: state.isSearchOpen,
//         openSearch,
//         closeSearch,
//         isChatOpen: state.isChatOpen,
//         toggleChat,
//         closeChat,
//         unreadChatCount: state.unreadChatCount,
//         setChatCount,
//         resetChatCount
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => useContext(AppContext);
