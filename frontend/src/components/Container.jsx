import React from 'react'

export const Container = (props) => {
  return (
    <div className="container container--narrow py-md-5">
       {props.children}
    </div>
  )
}
 export default Container