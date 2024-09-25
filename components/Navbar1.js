import React, { useState } from 'react';
import Link from 'next/link';
import styles from '/styles/Login.module.css';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

const logo = '/public/white_logo.png';
 

function Navbar1({ toggleOpen, handleStop }) {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => setClick(!click);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeMobileMenu = () => setClick(false);

  const onSubmit = async () => {
    try {
      await handleStop();  

      const response = await axios.get('/api/logout');
      if (response.status === 200) {
        console.log('Logged out successfully');
        router.push('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
            router.push('/500');
          }
        } 
      }
    }
  };

  const onSubmitDelete = async () => {
    try {
      await handleStop();  

      const response = await axios.delete('/api/deleteAccount');
      if (response.status === 200) {
        console.log('Account deleted successfully');
        router.push('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
            router.push('/500');
          }
        } 
      }
    }
  };

  return (
    <nav className='navbar1'>
      <div className='navbar-container'>
        <div className='navbar-logo'>
          <img
            src={logo}
            className="w-32 mx-auto"
            style={{
              position: 'absolute',
              top: -3,
              left: 25,
              width: '60px',
              height: '65px',
              marginTop: '10px',
              marginLeft: '95px'
            }}
            alt="logo"
          />
        </div>
        <div className={styles.camra1} style={{ left: 30, top: 22 }}>CamRa</div>
        <div className='menu-icon' style={{ fontWeight: 700 }} onClick={handleClick}>
          ...
        </div>

        <ul className={click ? 'nav-menu' : 'nav-menu'}>
          <li className='nav-item'>
            <div  
              className='nav-links'
              style={{ fontFamily: 'Josefin Sans', fontWeight: 600 }}
              onClick={toggleDropdown}
            >
              <span>ACCOUNT</span>
            </div>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <ul className='dropdown-menu text-white' style={{ fontSize: '15px', background: 'var(--color-gray-100)', fontWeight: 600,top: 90, right: 17,  position: 'absolute', padding: '30px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0)' }}>
                <li>
                  <button onClick={onSubmit} style={{ marginBottom: '30px' }}>LOG OUT</button>
                </li>
                <li>
                  <button onClick={onSubmitDelete}>DELETE</button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar1;
