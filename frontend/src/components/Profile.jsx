import { useEffect } from 'react'
import Page from './Page'
import { useParams, NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../context/app-context';
import ProfilePosts from './ProfilePosts';
import { useImmer } from 'use-immer';
import ProfileFollow from './ProfileFollow';

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user, isLoggedIn } = useApp();
  const [ state, setState ] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128',
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  });

useEffect(() => {
  if (!isLoggedIn) {
    navigate('/', { replace: true });
  }
}, [isLoggedIn, navigate]);

useEffect(() => {
  const ourRequest = axios.CancelToken.source()
  async function fetchData() {
    try {
      const response = await axios.post(`/profile/${username}`, { token: user?.token }, { cancelToken: ourRequest.token } );
      setState(draft => {
        draft.profileData = response.data;
      });

    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }
  fetchData();
    return () => {
      ourRequest.cancel()
    }
  }, [username]);

  useEffect(() => {
   if( state.startFollowingRequestCount ) {
    setState(draft => {
      draft.followActionLoading = true;
    });  
    const ourRequest = axios.CancelToken.source()
      async function fetchData() {
        try {
          const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: user?.token }, { cancelToken: ourRequest.token } );
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });

        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      fetchData();
        return () => {
          ourRequest.cancel()
        }
   }
  }, [state.startFollowingRequestCount]);


  useEffect(() => {
   if( state.stopFollowingRequestCount ) {
    setState(draft => {
      draft.followActionLoading = true;
    });  
    const ourRequest = axios.CancelToken.source()
      async function fetchData() {
        try {
          const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: user?.token }, { cancelToken: ourRequest.token } );
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });

        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      fetchData();
        return () => {
          ourRequest.cancel()
        }
   }
  }, [state.stopFollowingRequestCount]);
  const startFollowing = () => {
    setState(draft => {
      draft.followActionLoading = true;
      draft.startFollowingRequestCount++;
    });
  }

  const stopFollowing = () => {
    setState(draft => {
      draft.followActionLoading = true;
      draft.stopFollowingRequestCount++;
    });
  }

  // if(!isLoggedIn) {
  //   navigate('/');
  //   return null;
  // }
    return (
      <Page title="Your Profile">
        <h2>
          <img className="avatar-small" src={state.profileData.profileAvatar} /> { state.profileData.profileUsername }'s profile
            { isLoggedIn && user.username !== state.profileData.profileUsername && !state.profileData.isFollowing && 
            state.profileData.profileUserName !== "..." && 
            (
              <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
                Follow <i className="fas fa-user-plus"></i>
              </button>
            )}
            { isLoggedIn && user.username !== state.profileData.profileUsername && state.profileData.isFollowing && 
            state.profileData.profileUserName !== "..." && 
            (
              <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
                Stop Follow <i className="fas fa-user-times"></i>
              </button>
            )}
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <NavLink to={"/profile/" + state.profileData.profileUsername} end className="nav-item nav-link">
            Posts: {state.profileData.counts.postCount}
          </NavLink>
          <NavLink to={"/profile/" + state.profileData.profileUsername  + "/followers"} className="nav-item nav-link">
            Followers: {state.profileData.counts.followerCount}
          </NavLink>
          <NavLink to={"/profile/" + state.profileData.profileUsername  + "/following"} className="nav-item nav-link">
            Following: {state.profileData.counts.followingCount}
          </NavLink>
        </div>

        {/* <ProfilePosts /> */}
        <Routes>
          <Route path="" element={<ProfilePosts />} />
          <Route path="followers" element={<ProfileFollow type="followers" />} />
          <Route path="following" element={<ProfileFollow type="following" />} />
        </Routes>
      </Page>
    )
}

export default Profile