import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptiobox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">
                Description
            </div>
            <div className="descriptionbox-nav-box fade">
                reviews (122)
            </div>
        </div>
        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, consectetur dolore! Odio architecto saepe quae alias eaque. Sint eos laborum est dicta a repudiandae voluptatibus nisi, hic officia eum possimus!</p>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, ducimus.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox