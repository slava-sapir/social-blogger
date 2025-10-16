import { useEffect, useState } from 'react'
import Page from './Page'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'  
import LoadinDotsIcon from './LoadinDotsIcon'
import ReactMarkdown from 'react-markdown'
import { Tooltip as ReactTooltip} from 'react-tooltip'
import NotFound from './NotFound'
import { useApp } from '../context/app-context';

const ViewSinglePost = () => {
  const navigate = useNavigate();
  const useContext = useApp();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
        const ourRequest = axios.CancelToken.source();
        async function fetchPost() {    
            try {
            const response = await axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
            setPost(response.data);
            setIsLoading(false);
            } catch (e) {
                console.error('Error fetching posts:', e);
            } 
        }
        fetchPost();  
        return () => {
            ourRequest.cancel();
        }  
  }, [id]); 

 
  if(isLoading) return (
    <Page title="Loading Post...">
      <LoadinDotsIcon />
    </Page>
  )
    if(isLoading && !post) return (
    <NotFound />
  )

  function isAuthor() {
    if(useContext.isLoggedIn) {
       return post.author?.username === useContext.user?.username;   
    }
    return false;
  } 

  const deleteHandler = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (confirm) {
      try {
        const response = await axios.delete(`/post/${id}`, { data: { token: useContext.user.token } });
        if (response.data === "Success") {
          useContext.addFlashMessage('Post was successfully deleted.', 'success');
          navigate(`/profile/${useContext.user.username}`);
        }
      } catch (e) {
        console.error('Error deleting post:', e);
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        { isAuthor() && (
          <>
          <span className="text-success small">You are viewing your own post</span><span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tooltip-content="Edit" data-tooltip-id="edit" className="text-primary mr-2" title="Edit">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" place="bottom" effect="float" className='custom-tooltip'/>
            <a onClick={deleteHandler} className="delete-post-button text-danger" data-tooltip-content="Delete" data-tooltip-id="delete" title="Delete">
              <i className="fas fa-trash"></i>
              <ReactTooltip id="delete" className="Delete" />
            </a>
          </span>
          </>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar } />
        </Link>
        Posted by <Link to={`/profile/${post.author?.username}`}>{post.author?.username}</Link> on {new Date(post.createdDate).toLocaleDateString()}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} allowedElements={['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre']} >
          {post.body}
        </ReactMarkdown>
      </div>
      </Page>
  )
}

export default ViewSinglePost