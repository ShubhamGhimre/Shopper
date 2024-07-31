import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers in Your Email</h1>
        <p>Suscribe to our NewsLetter and stay updated</p>

        <div>
            <input type="email" placeholder='Your email ID ' />
            <button>Suscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter