import React, { useState } from 'react';
import Link from 'next/link';

const logo = '/public/white_logo.png';

function Navbar({ toggleOpen }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='navbar-logo'>
      
          </div>
          <div className='phrase' style={{ fontSize: 25 ,position: 'absolute', top: 0, left: 0, marginTop: '27px', marginBottom: '-10px', fontWeight: 700 , fontFamily: 'Satisfy ',marginLeft: '20px' }}> CamRa</div>
          <img src={logo} className="w-32 mx-auto" style={{ position: 'absolute', top: -3, left: -3, width: '60px', height: '65px', marginTop: '10px', marginLeft: '95px' }} alt="logo" />
          <div className='menu-icon' style={{ fontWeight: 700 }} onClick={handleClick}>
            ...
          </div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <div className='nav-links' onClick={closeMobileMenu} style={{ fontFamily: 'Helvetica', marginRight: '300px', fontWeight: 600 }}>
              <Link href="/login" passHref>Home</Link>
              </div>
            </li>
            <li className='nav-item'> <Link href="/register" passHref>
              <div className='nav-links' onClick={closeMobileMenu} style={{ fontFamily: 'Helvetica', marginRight: '150px', fontWeight: 600 }}>
              
               Sign Up
              </div></Link>
            </li>
            <li className='nav-item'>
              <div className='nav-links' style={{ fontFamily: 'Helvetica', fontWeight: 600 }} onClick={toggleOpen}>
              <Link href="" passHref>Log In</Link>
                
              </div>
            </li>
          </ul>

        </div>
      </nav>
    </>
  )
}

export default Navbar;
