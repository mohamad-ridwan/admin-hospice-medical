import React from 'react'
import './Loading.scss'

function Loading({
    style
}) {
  return (
    <div className="wrapp-loading" style={style}>
        <div className="loading-circle">

        </div>
    </div>
  )
}

export default Loading