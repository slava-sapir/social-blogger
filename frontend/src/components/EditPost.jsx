import { useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import Page from './Page'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'  
import LoadinDotsIcon from './LoadinDotsIcon'
import { useApp } from '../context/app-context';
import NotFound from './NotFound'

const EditPost = () => {
  const navigate =  useNavigate();
  const { id } = useParams();
  const useAppContext = useApp();

  const originalState = {
    title: { value: '', hasError: false, message: '' },
    body: { value: '', hasError: false, message: '' },
    originalTitle: '',
    originalBody: '',
    isFetching: true,
    isSaving: false,
    id:id,
    notFound: false,
    // sendCount: 0,
  }
  function postEditorReducer(draft, action) {
    switch (action.type) {
      case 'setPost':
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.originalTitle = action.value.title;
        draft.originalBody = action.value.body;
        draft.isFetching = false;
        return;
      case 'setTitle':
        draft.title.value = action.value;
         if (!action.value.trim()) {
          draft.title.hasError = true;
           draft.title.message = 'Title is required';
        } else {
          draft.title.hasError = false;
        }
        return;
      case 'setBody':
        draft.body.value = action.value;
         if (!action.value.trim()) {
          draft.body.hasError = true;
           draft.body.message = 'Title is required';
        } else {
          draft.body.hasError = false;
        }
        return;
      case 'setSaving':
        draft.isSaving = true;
        return;
      case 'setSaved':
        draft.isSaving = false;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = 'Title is required';
        } else {
          draft.title.hasError = false;
          draft.title.message = '';
        }
        return;
       case 'bodyRules':
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = 'Title is required';
        } else {
          draft.body.hasError = false;
          draft.body.message = '';
        }
        return;
        case 'notFound':
        draft.notFound = true;
        return;

      default:
        return draft;
    }
  }
  const [state, dispatch] = useImmerReducer(postEditorReducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });

    const hasChanged =
    state.title.value !== state.originalTitle ||
    state.body.value !== state.originalBody;

    if (!hasChanged) return; 
    const saveRequest = axios.CancelToken.source();

    dispatch({ type: 'setSaving' });
    axios.post(`/post/${id}/edit`, 
        { 
            title: state.title.value, 
            body: state.body.value, 
            token: useAppContext.user.token 
        }, 
        { 
            cancelToken : saveRequest.token 
        }).then(() => {
            dispatch({ type: 'setSaved' });
            if(hasChanged) {
            useAppContext.addFlashMessage("Post successfully updated.", 'success');
            }
        navigate(`/profile/${useAppContext.user.username}`);
        })
        .catch((e) => {
            if (axios.isCancel(e)) {
                console.log('Save request cancelled');
            } else {
                console.error('Save error:', e);
            }
    });
  }

  useEffect(() => {
     const ourRequest = axios.CancelToken.source();
        async function fetchPost() {    
            try {
            const response = await axios.get(`/post/${state.id}`, { cancelToken : ourRequest.token });
            if(response.data) {
                dispatch({ type: 'setPost', value: response.data });
                if(response.data.author?.username !== useAppContext.user.username) {
                    dispatch({ type: 'notFound' });
                    useAppContext.addFlashMessage("You do not have permission to edit this post.", 'danger');
                    navigate('/');
                }
            } else {
                dispatch({ type: 'notFound' });
                useAppContext.addFlashMessage("Post not found.", 'danger');
            }
            } catch (e) {
                console.error('Error fetching posts:', e);
            } 
        }
        fetchPost();    
        return () => ourRequest.cancel();
  }, [state.id]); 

    if(state.notFound) {
        return (
           <NotFound />
        )
    }

    if(state.isFetching) 
        return (
        <Page title="Loading Post...">
        <LoadinDotsIcon />
        </Page>
    )

  return (
    <Page title="Edit Post">
        <Link to={`/post/${state.id}`} className="small font-weight-bold">
            <i className="fas fa-arrow-left"></i> Back to Post
        </Link>
        <form onSubmit={submitHandler} className="container container--narrow mt-3">
            <div className="form-group">
            <label htmlFor="post-title" className="text-muted mb-1">
                <small>Title</small>
            </label>
            <input 
            onBlur={(e) => dispatch({ type: 'titleRules', value: e.target.value })}
            onChange={(e) => dispatch({ type: 'setTitle', value: e.target.value })} 
            value={state.title.value} 
            autoFocus 
            name="title" 
            id="post-title" 
            className="form-control form-control-lg form-control-title" 
            type="text" placeholder="" autoComplete="off" />
            {
                state.title.hasError &&
                <div className='alert alert-danger small liveValidateMessage'>{state.title.message}</div>
            }
            </div>

            <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
                <small>Body Content</small>
            </label>
            <textarea 
            onBlur={(e) => dispatch({ type: 'bodyRules', value: e.target.value })}
            onChange={(e) => dispatch({ type: 'setBody', value: e.target.value })} 
            value={state.body.value} name="body" id="post-body" 
            className="body-content tall-textarea form-control" type="text" />
            {
                state.body.hasError &&
                <div className='alert alert-danger small liveValidateMessage'>{state.body.message}</div>
            }
            </div>

            <button className="btn btn-primary" disabled={state.title.hasError || state.body.hasError || state.isSaving} type="submit">
                {state.isSaving ? 'Saving...' : 'Save Updates'}
            </button>
        </form>
    </Page>
  )
}

export default EditPost