import React, { useEffect } from 'react'
import { useApp } from '../context/app-context';
import { useImmer } from 'use-immer';
import axios from 'axios';
import Post from './Post';

const Search = () => {
  const { closeSearch  } = useApp();

  const [state, setState] = useImmer({
    searchTerm: '',
    results: [],
    show: 'neither',
    requestCount: 0
  });

  const handleSearchClose = (e) => {
    e.preventDefault();
    closeSearch();
  };

  useEffect(() => {
    const searchField = document.getElementById('live-search-field');
    searchField.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
   if(state.searchTerm.trim()) {
    setState((draft) => {
      draft.show = 'loading';
    });
     const delay = setTimeout(() => {
      setState((draft) => {
        if (draft.searchTerm.trim()) {
          draft.requestCount++;
        };
      });
    }, 1000);
    return () => clearTimeout(delay);
   } else {
    setState((draft) => {
      draft.show = 'neither';
    });
   }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const outRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: outRequest.token });
          console.log("fetchResults :",response.data);
          setState((draft) => {
            draft.results = response.data;
            draft.show = 'results';
          });
        } catch (e) {
          console.error('There was a problem or the request was cancelled.', e);
        }
      }
      fetchResults();
      return () => outRequest.cancel();
    }
  }, [state.requestCount]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      closeSearch();
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  };

  return (
    <>
      <div className="search-overlay">

        <div className="search-overlay-top shadow-sm">
          <div className="container container--narrow">
            <label htmlFor="live-search-field" className="search-overlay-icon">
              <i className="fas fa-search"></i>
            </label>
            <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
            <span onClick={handleSearchClose} className="close-live-search">
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
        </div>

        <div className="search-overlay-bottom">
          <div className="container container--narrow py-3">
            <div className={"circle-loader " + (state.show === 'loading' ? 'circle-loader--visible' : '')}></div>
            <div className={"live-search-results " + (state.show === "results" ? "live-search-results--visible" : '')}>
              <div className="list-group shadow-sm">
                <div className="list-group-item active"><strong>Search Results</strong> ({ state.results.length } { state.results.length === 1 ? 'result' : 'results' } found)</div>
                  {state.results.length ? state.results.map((post) => {
                    return <Post post={post} key={post._id} onClick={closeSearch} />
                  }) : <div className="alert alert-danger">Sorry, we could not find any results for that search.</div>}
                </div>
              </div>
            </div>
        </div>

      </div>
    </>
  )
}

export default Search