// src/components/HomeGuest.jsx
import { useEffect, useRef } from "react";
import axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import { useApp } from "../context/app-context";
import { initialState, reducer } from "../context/homeGuestState";

function HomeGuest() {
  const { login, addFlashMessage } = useApp();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const outRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            "/doesusernameExist",
            { username: state.username.value },
            { cancelToken: outRequest.token }
          );
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (e) {
          console.error("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => outRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const outRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToken: outRequest.token }
          );
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          console.error("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => outRequest.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      const outRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            "/register",
            { username: state.username.value, email: state.email.value, password: state.password.value },
            { cancelToken: outRequest.token }
          );
          if (response.data?.token) {
            login({
              token: response.data.token,
              username: response.data.username,
              avatar: response.data.avatar
            });
            addFlashMessage("Congrats! Welcome to your new account!", "success");
          }
        } catch (e) {
          console.error("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => outRequest.cancel();
    }
  }, [state.submitCount]);

  useEffect(() => {
    document.title = `Home | ComplexApp`;
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "usernameImmediate", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "emailImmediate", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true });
    dispatch({ type: "passwordImmediate", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  };

  return (
    <>
       <div className="container py-md-5">
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">
                        Are you sick of short tweets and impersonal &ldquo;shared&rdquo; 
                        posts that are reminiscent of the late 90&rsquo;s email forwards? 
                        We believe getting back to actually writing is the key to enjoying 
                        the internet again.
                    </p>
                 </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                 <form onSubmit={handleSubmit}>
                     <div className="form-group">
                        <label htmlFor="username-register" className="text-muted mb-1">
                            <small>Username</small>
                        </label>
                    <input
                        onChange={(e) => dispatch({ type: "usernameImmediate", value: e.target.value })}
                        id="username-register"
                        name="username"
                        className="form-control"
                        type="text"
                        placeholder="Pick a username"
                        autoComplete="off"
                    />
                    <CSSTransition nodeRef={usernameRef} in={state.username.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div ref={usernameRef} className="alert alert-danger small liveValidateMessage">
                         {state.username.message}
                        </div>
                    </CSSTransition>
                    </div>
                    <div className="form-group">
                     <label htmlFor="email-register" className="text-muted mb-1">
                         <small>Email</small>
                     </label>
                     <input onChange={(e) => dispatch({type: "emailImmediate", value: e.target.value})} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                     <CSSTransition nodeRef={emailRef} in={state.email.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div ref={emailRef} className="alert alert-danger small liveValidateMessage">
                            {state.email.message}
                        </div>
                     </CSSTransition>
                     </div>
                     <div className="form-group">
                     <label htmlFor="password-register" className="text-muted mb-1">
                         <small>Password</small>
                     </label>
                     <input onChange={(e) => dispatch({type: "passwordImmediate", value: e.target.value})} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
                     <CSSTransition nodeRef={passwordRef} in={state.password.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div ref={passwordRef} className="alert alert-danger small liveValidateMessage">
                            {state.password.message}
                        </div>
                     </CSSTransition>
                     </div>
                     <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                     Sign up for ComplexApp
                     </button>

                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default HomeGuest;
