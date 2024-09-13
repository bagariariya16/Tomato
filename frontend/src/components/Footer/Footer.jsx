import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer' id ='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo}
                alt=""/>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio, rerum necessitatibus laudantium perspiciatis ipsam alias eos maxime iste magnam nisi eaque optio architecto. Voluptatem, accusamus dolor itaque aliquam velit officia?</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            
            <div className="footer-content-center">

                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>
                    Get In Touch
                </h2>
                <ul>
                    <li>+91-123-123-6489</li>
                    <li>contact@tomato.com</li>
                </ul>
            </div>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2024 &copy; Tomato.com - All Rights Reserved. </p>
    </div>
  )
}

export default Footer
