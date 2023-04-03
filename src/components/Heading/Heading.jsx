import React from 'react'
import { Helmet } from 'react-helmet'

function Heading({
    title,
    content
}) {
  return <Helmet>
    <title>{title}</title>
    <meta name="description" content={content} />
  </Helmet>
}

export default Heading