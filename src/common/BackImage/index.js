import React from 'react'
import './index.css'

const BackImage = ({children , title}) => {
    return (
        <header className={title}>
            {children}
        </header>
    )
}

BackImage.defaultProps = {
    title :"defaultBackground"
}

export default BackImage
