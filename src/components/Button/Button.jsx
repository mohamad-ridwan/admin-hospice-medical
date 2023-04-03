import React from 'react'
import './Button.scss'

function Button({
    name,
    click,
    style
}) {
  return <button className="btn-card" onClick={click} style={style}>
    {name}
  </button>
}

export default Button