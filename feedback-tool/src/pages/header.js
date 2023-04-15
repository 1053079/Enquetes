import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    return (
        <nav>
            <div classname='header'>
                <div className='header_information'>
                    <img className="SVG" width="208" height="50" src="https://www.dyflexis.com/wp-content/uploads/2019/04/logo-dyflexis-2.svg"></img>
                    <div className='header_links'>
                        <Link to='/' className='link' style={{ marginLeft: '10px', marginRight: '20px' }}>Home</Link>
                        <Link to='./About' className='link' style={{ marginRight: '20px' }}>About us</Link>
                        <Link to='./contact' className='link' style={{ marginRight: '20px' }}>Contact Us</Link>
                    </div>
                    <div className='nav_login'>
                        <div className='login_button'>
                            <Link to='./Login' className='link'>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header