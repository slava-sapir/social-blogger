import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Page from './Page';
import LoadinDotsIcon from './LoadinDotsIcon';

const ProfileFollow = (prop) => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();
        async function fetchPosts() {  
            try {
            const response = await axios.get(`/profile/${username}/${prop.type}`, { cancelToken: ourRequest.token });
            setPosts(response.data);
            console.log(response.data);
            setIsLoading(false);
            } catch (e) {
                console.error('Error fetching posts:', e);
            } 
        }
        fetchPosts();   
        return () => {
            ourRequest.cancel();
        } 
    }, [username, prop.type]);                   
            
    if(isLoading) return (
        <Page title="Loading Post...">
          <LoadinDotsIcon />
        </Page>
    )

  return (
    <>
      { posts.length === 0 ? (
        prop.type === "followers" ? (
          <Page title="No followers">
            <p className="lead text-center list-group-item active">No followers yet.</p>
          </Page>
        ) : (
          <Page title="No following">
            <p className="lead text-center list-group-item active">Not following anyone yet.</p>
          </Page>
        )
      ) : (
          posts.map((follow, index) => (
            <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action flex-column align-items-start">
              <img className="avatar-tiny" src={follow.avatar} />&nbsp;&nbsp;&nbsp;{follow.username}
            </Link>
          ))
      )
     }
    </>
  )
}

export default ProfileFollow