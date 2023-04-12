import React from 'react'
import './Button.scss'

function Button({
    name,
    click,
    style,
    classBtn
}) {
  return <button className={classBtn ? `btn-card ${classBtn}` : 'btn-card'} onClick={click} style={style}>
    {name}
  </button>
}

export default Button