import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Page from './Page';
import LoadinDotsIcon from './LoadinDotsIcon';
import Post from './Post';

const ProfilePosts = () => {
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();
        async function fetchPosts() {  
            try {
            const response = await axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
            setPosts(response.data);
            setIsLoading(false);
            } catch (e) {
                console.error('Error fetching posts:', e);
            } 
        }
        fetchPosts();   
        return () => {
            ourRequest.cancel();
        } 
    }, [username]);                   
            
    if(isLoading) return (
        <Page title="Loading Post...">
          <LoadinDotsIcon />
        </Page>
    )

  return (
        <div className="list-group">
            {posts.map(post => (
                <Post noAuthor={true} post={post} key={post._id} />
            ))}
        </div>
  )
}

export default ProfilePosts