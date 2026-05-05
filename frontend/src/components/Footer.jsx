import React from 'react';
import { useState } from 'react';
import '../styles/Footer.css';


function Footer(){
    return (
        <footer className="foot">
            <div className="tog">
            <div className="c1">
                <h2>NewsSetu</h2>
                <p>Your trusted source for latest updates and insights .</p>
            </div> 


            <div className="sec">
                <h3 className="r">Categories</h3>
               
                <p>Politics</p>
                <p>Technology</p>
                <p>Sports</p>
                <p>World</p>
                <p>Business</p>
        
            </div>


            <div className="sec">
                <h3 className="r">Links</h3>
               
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/terms">Terms</a></li>
            </div>
            

            <div className="sec lo">
                <div className=" quote"><h3 className="r">Journalism with clarity and credibility.</h3>
                
                </div>
                <div className="end">© {new Date().getFullYear()} NewsSetu. All Rights Reserved...</div>
               
            </div>
            </div>

        </footer>
    );

}

export default Footer;