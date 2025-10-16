import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
     <Page title="Post not found">
        <div className="text-center">
            <h2>Post not found.</h2>
            <p className='lead text-muted'>The requested post could not be found.
            but you can visite our <Link to="/">homepage</Link> for the fresh start.
            </p>
        </div>
    </Page>
  )
}

export default NotFound