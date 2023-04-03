import React from 'react'
import './ButtonGuide.scss'

function ButtonGuide({
  click
}) {
  return <button className="btn-guide"
  onClick={click}
  >
    <i className="fa-duotone fa-question"></i>
  </button>
}

export default ButtonGuide