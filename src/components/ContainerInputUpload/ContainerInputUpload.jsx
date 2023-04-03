import React from 'react'
import './ContainerInputUpload.scss'

function ContainerInputUpload({
    children,
    style
}) {
    return (
        <>
            <div className="container-input-upload">
                <div className="center-input-upload" style={style}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ContainerInputUpload