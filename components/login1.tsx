import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";
import Link from 'next/link';
import Image from 'next/image';
import Head from "next/head";

interface UserData {
  username: string;
  password: string;
}

const defaultUserData: UserData = { username: "", password: "" };
const logo = '/public/white_logo.png';
const internetImageURL = 'https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg';

const StartingPage = () => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onUsernameChange = (e) => {
    setUserData({ ...userData, username: e.target.value });
  }

  const onPasswordChange = (e) => {
    setUserData({ ...userData, password: e.target.value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!userData.username || !userData.password) {
      alert("Please fill all mandatory parameters");
      return;
    }
    try {
      const response = await axios.post('/api/login', userData);
      if (response.status === 200) {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login.");
    }
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle, #2A336A,  #061B31)',
      backgroundSize: 'cover', // Adjusted to cover the container
      // backgroundSize: '300% 300%',
      animation: 'color 20s ease-in-out infinite',
    },
    content: {
      maxWidth: '1300px',
      width: '100%',
      minHeight: '90vh', // Adjusted height
      backgroundColor: 'black',
      borderRadius: '7px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, .7)',
    },
  };

  return (

    <div style={styles.container}>
         <Head>
    <title>CamRa</title>

    <link rel="icon" href="/FinalLogo10.png"/>
    </Head>
      <div style={styles.content}>
        <div className="text-gray-900 flex justify-center">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
            <Image src={logo} className="w-33" alt="logo" width={200} height={100} style={{ marginLeft: '140px' }} />

            </div>
            <div className=" flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold text-white">Login</h1>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                  <form onSubmit={(e) => onSubmit(e)}>
                    <input
                      className="w-full px-3 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      placeholder='Username'
                      id="username"
                      type="text"
                      value={userData.username}
                      onChange={(e) => onUsernameChange(e)}
                    />
                    <input
                      className="w-full px-3 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      placeholder='Password'
                      id="password"
                      type="password"
                      value={userData.password}
                      onChange={(e) => onPasswordChange(e)}
                    />
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-blue-700 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <span className="ml-2">Login</span>
                    </button>
                  </form>
                  {error && <p className="mt-3 text-red-500">{error}</p>}
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to Video Stream{"'s "}
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Terms of Service{' '}
                    </a>
                    and its{' '}
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Privacy Policy
                    </a>
                  </p>
                  <div className="text-center">
                    <Link href="/register" passHref>
                      <p className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800">
                        Don{"'"}t have an account? Register!
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black-100 text-center hidden lg:flex rounded-r-md h-[705px] overflow-hidden">

          <div
            className="m-12 xl:m-16 w-full   bg-contain bg-center bg-no-repeat  "
            style={{ backgroundImage: 'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")' }}
          ></div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default StartingPage;
