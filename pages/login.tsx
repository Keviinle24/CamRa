import React, { useState } from "react";

import { FunctionComponent } from "react";
 
import styles from "/styles/Login.module.css";
import Link from 'next/link';
 
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import Root from '../components/Root';
import { Modal } from "./_app";
import Head from "next/head";
 
 
interface UserData {
  email: string;
  password: string;
}
 
const defaultData: UserData = { email: "", password: "" };
const logo = '/public/FinalLogo4.png';
const curve = '/public/underline.png';
const internetImageURL = '/public/top.png';


const Desktop: FunctionComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
   const [data, setData] = useState<UserData>(defaultData);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSlideshowEnabled, setIsSlideshowEnabled] = useState(true);
  const [error, setError] = useState<string>('');
  const toggleOpen2 = () => setIsOpen2(!isOpen2);
   const toggleOpen = () => setIsOpen(!isOpen);
   const toggleOpen3 = () => setIsOpen3(!isOpen3);
   const [isOpen3, setIsOpen3] = useState(false);
  const router = useRouter();
  const onEmailChange = (e) => {
    setData({ ...data, email: e.target.value });
    setEmail(e.target.value);
  }

  const onPasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
    setPassword(e.target.value);
  }
    
 
    const validateEmail = (email) => {
        // Simple email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
  }

  
  if (password.length < 0) {
      alert('Password field incomplete');
      return;
  } 

    if (!data.email || !data.password) {
      alert("Please fill all mandatory parameters");
      return;
    }

    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.status === 400) {
        setError('Email or password is incorrect');
        console.log('Response status:', response.status);
      } else if (response.status === 200) {
        console.log('Response status:', response.status);
        router.push('/');
      }
    } catch (error) {
      // if (error.response) {
      //   console.log('Error Response Data:', error.response.data);
      //   console.log('Error Response Status:', error.response.status);
      //   console.log('Error Response Headers:', error.response.headers);
      //   // setError(`Email or password is incorrect`);
      //   alert('Email or password is incorrect');
    
      // } 

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
            console.log('Error Response Data:', axiosError.response.data);
            console.log('Error Response Status:', axiosError.response.status);
            console.log('Error Response Headers:', axiosError.response.headers);
            alert('Email or password is incorrect');
          }
        } 
      }
    }
  }
  const toggleMenu = () => {
   setMenuOpen(!menuOpen);
 };

 const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
 
  return (
    
    <div className={styles.desktop1}>
        <Head>
    <title>CamRa</title>
    <link rel="icon" href="/public/FinalLogo10.png" />
  </Head>
      
   
      
      <div className={styles.vectorParent1}>
 
  
      
        
       
        <div className={styles.frameDiv} />
      </div>
      <div className={styles.component6variant3}>
        <div className={styles.frameIcon} />
        <div className={styles.image1Icon} > </div>        <div className={styles.image1Icon1}  > <Root/></div>
      
    
       {/* Hamburger Menu for Mobile */}
       <div className={styles.hamburger} onClick={toggleMenu} >
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${styles.menu} ${menuOpen ? styles.active : ""}`}>
      <button> <b className={styles.home} onClick={toggleOpen }>LOGIN</b></button>
        <Modal isOpen={isOpen} toggleOpen={toggleOpen }>
         <div className="text-gray-900 flex justify-center" style={{width: 1050, marginLeft: -55}}>
         <div className="bg-white flex justify-center flex-1 shadow sm:rounded-lg">
            <div className="lg:w-1/2 xl:w-5/12 p-12 sm:p-12">
             <div>
                  <Image src={logo} className=" " alt="logo" width={115} height={115} style={{margin: '0 auto',  paddingLeft: 30,      marginBottom: 0  }} />
             </div>
               <div className="flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl font-extrabold" style={{ fontFamily: 'Josefin Sans', marginBottom: 13, marginLeft: 15 }}>Login</h1>
                <div className="w-full flex-1 "  >
                 <div className="mx-auto max-w-xs">
                     <form onSubmit={(e) => onSubmit(e)}>
                      <input
                          className="w-full px-3 py-4 rounded font-medium bg-gray-100  border border-black placeholder-gray-500  text-black text-sm focus:outline-none  focus:border-black focus:bg-white mt-5" 
                          placeholder="Email"
                          id="username"
                          type="text"
                          value={email}
                          onChange={(e) => onEmailChange(e)}
                        />
                        <input
                          className="w-full px-3 py-4 rounded  font-medium bg-gray-100  border border-black placeholder-gray-500  text-black text-sm focus:outline-none  focus:border-black focus:bg-white mt-5"
                          placeholder="Password"
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => onPasswordChange(e)}
                        />
                        <button
                          type="submit"
                          className="mt-5 tracking-wide font-semibold bg-black text-gray-100 w-full py-4 rounded-full  hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          <span className="ml-3">Login</span>
                        </button>
                      </form>
                      {error && <p className="mt-3 text-red-500">{error}</p>}
                      <p className="mt-6 text-xs text-gray-600 text-center">
                        I agree to Video Stream{"'s "}
                        <a href="#" className="border-b border-gray-500 border-dotted" onClick={toggleOpen3}>
                          Terms of Service{' '}
                        </a>
                        and its{' '}
                        <a href="#" className="border-b border-gray-500 border-dotted" onClick={toggleOpen2}>
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
              <div className="flex-1 text-center hidden lg:flex shadow sm:rounded-r-lg" style = {{background: '#091F49'}}>
                <div className="m-12 xl:m-16  bg-contain bg-center bg-no-repeat" style={{width: 500, marginLeft: 70, backgroundImage: `url(${internetImageURL})` }}></div>
              </div>
            </div>
          </div>
        </Modal>
        <Link href="/register" passHref> <b className={styles.merch}>SIGN UP</b> </Link>
        <button onClick={scrollToBottom} className="scrollToBottomButton"> <b className={styles.premium}>CONTACT</b>    </button>
     
       
      </div>
    
  
          
      <Link href="/register" passHref>
      <button className={styles.getStarted2} ><b>
        Get Started</b>
      </button>
    </Link>


    
        <b className={styles.theFuture}>{`THE FUTURE `}</b>
        <b className={styles.ofCollegeNetworking}>OF COLLEGE NETWORKING</b>
        <div className={styles.connectWithCollege1}>
          Connect with college students around the world with           . Connect, meet,
          and chat with students like yourself with just a click. Sign up today and start expanding your network!
        </div>
        <div className={styles.camra1}>CamRa</div>
        <div className={styles.camra2}>CamRa</div>
        <img
          className={styles.whiteLogo1Icon}
          alt=""
          src="/public/white_logo.png"
        />
     
    
    
      </div>
      <div className={styles.desktop1Child} />
      <div className={styles.frame6variant3}>
  
 

        <img className={styles.whiteLogo3Icon11}
          
          alt=""
          src="/public/Variant3.png"
        />
 
        <div className={styles.frameDiv} />
      </div>
      <div className={styles.frame6component7variant3}>
        <div className={styles.camraParent}>
          <div className={styles.camra}>CamRa</div>
          <b className={styles.createLongLastingConnectionContainer}>
            <span className={styles.createLongLastingConnection}>
              Create long-lasting connections
            </span>
            <span>{` one university at a time `}</span>
          </b>
          <div className={styles.connectWithCollege}>
          Join            to connect with college students globally! Explore the lives and campuses of other students. Discover new friends, share experiences, and engage in meaningful conversations—all at your fingertips!
          </div>
         
          <img
            className={styles.whiteLogo5Icon}
            alt=""
            src="/public/Frame 7.png"
          />
     
       
     <Link href="/register" passHref>
          <b className={styles.getStarted}> <div style = {{marginTop: 22, marginLeft: 39}}>JOIN NOW</div></b></Link>
      
      
        </div>
      </div>
      
      <div className={styles.component8variant3}>
        
       
        <b className={styles.exploringDifferentPerspectivContainer}>
          
          <span className={styles.createLongLastingConnection}>Exploring</span>
          <span> different perspectives</span>
        </b>
        
        <div className={styles.connectWithCollege2}>
        Get a peek into the life of other students and their colleges around the world. Explore diverse cultures, share experiences, and build connections! Sign up for free today!


        </div>
        <div style = {{marginBottom: 100}}> <img
          className={styles.whiteLogoIcon1}
          alt=""
          src="/public/Rectangle 16.png"
        /></div>
   
   <Link href="/register" passHref>    <b   className={styles.getStarted6}><div style = {{marginTop: 22, marginLeft: 39}}>REGISTER</div></b></Link>
       
   
  
      </div>

      <div className={styles.component9variant3} >
 
  
      <img
       className={styles.rectangleDiv}
            alt=""
            src="/public/Rectangle 17 (1).png"
          />
     
        <b   className={styles.connectWithUs}>CONNECT WITH US</b>
        <a href="https://www.instagram.com/officialcamra.me/" target="_blank">    <b className={styles.officialcamrame}>@officialcamra.me</b></a>
        <b className={styles.verifycamrame}>feedback@camra.me</b>
        <b className={styles.getTheLatest}>
          Get the latest updates and giveaways here!
        </b>
       
        <a href="https://www.instagram.com/officialcamra.me/" target="_blank">
        <img className={styles.instagramIcon} alt="" src="/public/Instagram.png" /></a>
        <img className={styles.mailIcon} alt="" src="/public/Mail.png" />
      </div>
      <div className={styles.frame16variant4} >
      <a href="https://www.instagram.com/officialcamra.me/" target="_blank">    <img className={styles.instagramIcon1} alt="" src="/public/InstagramNormal.png" /></a>
        {/* <b className={styles.home1}>Home</b> */}
        <button className={styles.terms} onClick={toggleOpen3}>Terms</button>
        <button className={styles.privacy} onClick={toggleOpen2}>Privacy</button>
       
        {/* <div className={styles.conditions}>Conditions</div> */}
        {/* <b className={styles.help}>Help</b>
        <b className={styles.aboutUs}>About Us</b>
        <b className={styles.services}>Services</b>
        <b className={styles.contact1}>Contact</b> */}
        <div className={styles.lineDiv} />
        <a href="https://www.linkedin.com/company/camrame/" target="_blank">     <img className={styles.linkedinIcon} alt="" src="/public/Linkedin.png" /></a>
        
      </div>
      <div style={{ position:"absolute", left: 0, bottom: 0, padding: '10px', color: 'gray', fontSize: '10px' }}>
  Design inspired by Vidscape Code
</div>
<Modal isOpen={isOpen2} toggleOpen={toggleOpen2 }>
        <div className="text-gray-900 flex justify-center" style={{width: 1050, marginLeft: -55 }}>
         <div className="bg-white flex justify-center flex-1 shadow sm:rounded-lg">
            <div className="   p-12 sm:p-12" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <p>Last updated: June 15, 2024</p>
                    <br/>
                    <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure
                        of Your information when You use the Service and tells You about Your privacy rights and how the
                        law protects You.</p>
                    <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to
                        the collection and use of information in accordance with this Privacy Policy. This Privacy
                        Policy has been created with the help of the <a
                            href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/" target="_blank">Free
                            Privacy Policy Generator</a>.</p>
                    <br/>
                    <h2>Interpretation and Definitions</h2>
                    <br/>
                    <h3>Interpretation</h3>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following
                        conditions. The following definitions shall have the same meaning regardless of whether they
                        appear in singular or in plural.</p>
                    <br/>
                    <h3>Definitions</h3>
                    <p>For the purposes of this Privacy Policy:</p>
                    <ul>
                        <li>
                            <p><strong>Account</strong> means a unique account created for You to access our Service or
                                parts of our Service.</p>
                        </li>
                        <li>
                            <p><strong>Affiliate</strong> means an entity that controls, is controlled by or is under
                                common control with a party, where &quot;control&quot; means ownership of 50% or more of
                                the shares, equity interest or other securities entitled to vote for election of
                                directors or other managing authority.</p>
                        </li>
                        <li>
                            <p><strong>Application</strong> refers to Camra, the software program provided by the
                                Company.</p>
                        </li>
                        <li>
                            <p><strong>Company</strong> (referred to as either &quot;the
                                Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement)
                                refers to Camra.</p>
                        </li>
                        <li>
                            <p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device
                                or any other device by a website, containing the details of Your browsing history on
                                that website among its many uses.</p>
                        </li>
                        <li>
                            <p><strong>Country</strong> refers to: New York, United States</p>
                        </li>
                        <li>
                            <p><strong>Device</strong> means any device that can access the Service such as a computer,
                                a cellphone or a digital tablet.</p>
                        </li>
                        <li>
                            <p><strong>Personal Data</strong> is any information that relates to an identified or
                                identifiable individual.</p>
                        </li>
                        <li>
                            <p><strong>Service</strong> refers to the Application or the Website or both.</p>
                        </li>
                        <li>
                            <p><strong>Service Provider</strong> means any natural or legal person who processes the
                                data on behalf of the Company. It refers to third-party companies or individuals
                                employed by the Company to facilitate the Service, to provide the Service on behalf of
                                the Company, to perform services related to the Service or to assist the Company in
                                analyzing how the Service is used.</p>
                        </li>
                        <li>
                            <p><strong>Third-party Social Media Service</strong> refers to any website or any social
                                network website through which a User can log in or create an account to use the Service.
                            </p>
                        </li>
                        <li>
                            <p><strong>Usage Data</strong> refers to data collected automatically, either generated by
                                the use of the Service or from the Service infrastructure itself (for example, the
                                duration of a page visit).</p>
                        </li>
                        <li>
                            <p><strong>Website</strong> refers to Camra, accessible from <a href="Camra.me"
                                                                                            rel="external nofollow noopener"
                                                                                            target="_blank">Camra.me</a>
                            </p>
                        </li>
                        <li>
                            <p><strong>You</strong> means the individual accessing or using the Service, or the company,
                                or other legal entity on behalf of which such individual is accessing or using the
                                Service, as applicable.</p>
                        </li>
                    </ul>
                    <br/>
                    <h2>Collecting and Using Your Personal Data</h2>
                    <br/>
                    <h3>Types of Data Collected</h3>
                    <br/>
                    <h4>Personal Data</h4>
                    <p>While using Our Service, We may ask You to provide Us with certain personally identifiable
                        information that can be used to contact or identify You. Personally identifiable information may
                        include, but is not limited to:</p>
                    <ul>
                        <li>
                            <p>Email address</p>
                        </li>
                        <li>
                            <p>First name and last name</p>
                        </li>
                        <li>
                            <p>Phone number</p>
                        </li>
                        <li>
                            <p>Address, State, Province, ZIP/Postal code, City</p>
                        </li>
                        <li>
                            <p>Usage Data</p>
                        </li>
                    </ul>
                    <br/>
                    <h4>Usage Data</h4>
                    <p>Usage Data is collected automatically when using the Service.</p>
                    <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP
                        address), browser type, browser version, the pages of our Service that You visit, the time and
                        date of Your visit, the time spent on those pages, unique device identifiers and other
                        diagnostic data.</p>
                    <p>When You access the Service by or through a mobile device, We may collect certain information
                        automatically, including, but not limited to, the type of mobile device You use, Your mobile
                        device unique ID, the IP address of Your mobile device, Your mobile operating system, the type
                        of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
                    <p>We may also collect information that Your browser sends whenever You visit our Service or when
                        You access the Service by or through a mobile device.</p>
                    <br/>
                    <h4>Information from Third-Party Social Media Services</h4>
                    <p>The Company allows You to create an account and log in to use the Service through the following
                        Third-party Social Media Services:</p>
                    <ul>
                        <li>Google</li>
                        <li>Facebook</li>
                        <li>Instagram</li>
                        <li>Twitter</li>
                        <li>LinkedIn</li>
                    </ul>
                    <p>If You decide to register through or otherwise grant us access to a Third-Party Social Media
                        Service, We may collect Personal data that is already associated with Your Third-Party Social
                        Media Service's account, such as Your name, Your email address, Your activities or Your contact
                        list associated with that account.</p>
                    <p>You may also have the option of sharing additional information with the Company through Your
                        Third-Party Social Media Service's account. If You choose to provide such information and
                        Personal Data, during registration or otherwise, You are giving the Company permission to use,
                        share, and store it in a manner consistent with this Privacy Policy.</p>
                    <br/>
                    <h4>Information Collected while Using the Application</h4>
                    <p>While using Our Application, in order to provide features of Our Application, We may collect,
                        with Your prior permission:</p>
                    <ul>
                        <li>Information regarding your location</li>
                        <li>Information from your Device's phone book (contacts list)</li>
                        <li>Pictures and other information from your Device's camera and photo library</li>
                    </ul>
                    <p>We use this information to provide features of Our Service, to improve and customize Our Service.
                        The information may be uploaded to the Company's servers and/or a Service Provider's server or
                        it may be simply stored on Your device.</p>
                    <p>You can enable or disable access to this information at any time, through Your Device
                        settings.</p>
                    <br/>
                    <h4>Tracking Technologies and Cookies</h4>
                    <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store
                        certain information. Tracking technologies used are beacons, tags, and scripts to collect and
                        track information and to improve and analyze Our Service. The technologies We use may
                        include:</p>
                    <ul>
                        <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device.
                            You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being
                            sent. However, if You do not accept Cookies, You may not be able to use some parts of our
                            Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our
                            Service may use Cookies.
                        </li>
                        <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain
                            small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and
                            single-pixel gifs) that permit the Company, for example, to count users who have visited
                            those pages or opened an email and for other related website statistics (for example,
                            recording the popularity of a certain section and verifying system and server integrity).
                        </li>
                    </ul>
                    <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain
                        on Your personal computer or mobile device when You go offline, while Session Cookies are
                        deleted as soon as You close Your web browser. Learn more about cookies on the <a
                            href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking"
                            target="_blank">Free Privacy Policy website</a> article.</p>
                    <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
                    <ul>
                        <li>
                            <p><strong>Necessary / Essential Cookies</strong></p>
                            <p>Type: Session Cookies</p>
                            <p>Administered by: Us</p>
                            <p>Purpose: These Cookies are essential to provide You with services available through the
                                Website and to enable You to use some of its features. They help to authenticate users
                                and prevent fraudulent use of user accounts. Without these Cookies, the services that
                                You have asked for cannot be provided, and We only use these Cookies to provide You with
                                those services.</p>
                        </li>
                        <li>
                            <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
                            <p>Type: Persistent Cookies</p>
                            <p>Administered by: Us</p>
                            <p>Purpose: These Cookies identify if users have accepted the use of cookies on the
                                Website.</p>
                        </li>
                        <li>
                            <p><strong>Functionality Cookies</strong></p>
                            <p>Type: Persistent Cookies</p>
                            <p>Administered by: Us</p>
                            <p>Purpose: These Cookies allow us to remember choices You make when You use the Website,
                                such as remembering your login details or language preference. The purpose of these
                                Cookies is to provide You with a more personal experience and to avoid You having to
                                re-enter your preferences every time You use the Website.</p>
                        </li>
                    </ul>
                    <p>For more information about the cookies we use and your choices regarding cookies, please visit
                        our Cookies Policy or the Cookies section of our Privacy Policy.</p>
                    <br/>
                    <h3>Use of Your Personal Data</h3>
                    <p>The Company may use Personal Data for the following purposes:</p>
                    <ul>
                        <li>
                            <p><strong>To provide and maintain our Service</strong>, including to monitor the usage of
                                our Service.</p>
                        </li>
                        <li>
                            <p><strong>To manage Your Account:</strong> to manage Your registration as a user of the
                                Service. The Personal Data You provide can give You access to different functionalities
                                of the Service that are available to You as a registered user.</p>
                        </li>
                        <li>
                            <p><strong>For the performance of a contract:</strong> the development, compliance and
                                undertaking of the purchase contract for the products, items or services You have
                                purchased or of any other contract with Us through the Service.</p>
                        </li>
                        <li>
                            <p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other
                                equivalent forms of electronic communication, such as a mobile application's push
                                notifications regarding updates or informative communications related to the
                                functionalities, products or contracted services, including the security updates, when
                                necessary or reasonable for their implementation.</p>
                        </li>
                        <li>
                            <p><strong>To provide You</strong> with news, special offers and general information about
                                other goods, services and events which we offer that are similar to those that you have
                                already purchased or enquired about unless You have opted not to receive such
                                information.</p>
                        </li>
                        <li>
                            <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p>
                        </li>
                        <li>
                            <p><strong>For business transfers:</strong> We may use Your information to evaluate or
                                conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale
                                or transfer of some or all of Our assets, whether as a going concern or as part of
                                bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about
                                our Service users is among the assets transferred.</p>
                        </li>
                        <li>
                            <p><strong>For other purposes</strong>: We may use Your information for other purposes, such
                                as data analysis, identifying usage trends, determining the effectiveness of our
                                promotional campaigns and to evaluate and improve our Service, products, services,
                                marketing and your experience.</p>
                        </li>
                    </ul>
                    <p>We may share Your personal information in the following situations:</p>
                    <ul>
                        <li><strong>With Service Providers:</strong> We may share Your personal information with Service
                            Providers to monitor and analyze the use of our Service, to contact You.
                        </li>
                        <li><strong>For business transfers:</strong> We may share or transfer Your personal information
                            in connection with, or during negotiations of, any merger, sale of Company assets,
                            financing, or acquisition of all or a portion of Our business to another company.
                        </li>
                        <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in
                            which case we will require those affiliates to honor this Privacy Policy. Affiliates include
                            Our parent company and any other subsidiaries, joint venture partners or other companies
                            that We control or that are under common control with Us.
                        </li>
                        <li><strong>With business partners:</strong> We may share Your information with Our business
                            partners to offer You certain products, services or promotions.
                        </li>
                        <li><strong>With other users:</strong> when You share personal information or otherwise interact
                            in the public areas with other users, such information may be viewed by all users and may be
                            publicly distributed outside. If You interact with other users or register through a
                            Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may
                            see Your name, profile, pictures and description of Your activity. Similarly, other users
                            will be able to view descriptions of Your activity, communicate with You and view Your
                            profile.
                        </li>
                        <li><strong>With Your consent</strong>: We may disclose Your personal information for any other
                            purpose with Your consent.
                        </li>
                    </ul>
                    <br/>
                    <h3>Retention of Your Personal Data</h3>
                    <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set
                        out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to
                        comply with our legal obligations (for example, if we are required to retain your data to comply
                        with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
                    <p>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally
                        retained for a shorter period of time, except when this data is used to strengthen the security
                        or to improve the functionality of Our Service, or We are legally obligated to retain this data
                        for longer time periods.</p>
                    <br/>
                    <h3>Transfer of Your Personal Data</h3>
                    <p>Your information, including Personal Data, is processed at the Company's operating offices and in
                        any other places where the parties involved in the processing are located. It means that this
                        information may be transferred to — and maintained on — computers located outside of Your state,
                        province, country or other governmental jurisdiction where the data protection laws may differ
                        than those from Your jurisdiction.</p>
                    <p>Your consent to this Privacy Policy followed by Your submission of such information represents
                        Your agreement to that transfer.</p>
                    <p>The Company will take all steps reasonably necessary to ensure that Your data is treated securely
                        and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place
                        to an organization or a country unless there are adequate controls in place including the
                        security of Your data and other personal information.</p>
                    <br/>
                    <h3>Delete Your Personal Data</h3>
                    <p>You have the right to delete or request that We assist in deleting the Personal Data that We have
                        collected about You.</p>
                    <p>Our Service may give You the ability to delete certain information about You from within the
                        Service.</p>
                    <p>You may update, amend, or delete Your information at any time by signing in to Your Account, if
                        you have one, and visiting the account settings section that allows you to manage Your personal
                        information. You may also contact Us to request access to, correct, or delete any personal
                        information that You have provided to Us.</p>
                    <p>Please note, however, that We may need to retain certain information when we have a legal
                        obligation or lawful basis to do so.</p>
                    <br/>
                    <h3>Disclosure of Your Personal Data</h3>
                    <br/>
                    <h4>Business Transactions</h4>
                    <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be
                        transferred. We will provide notice before Your Personal Data is transferred and becomes subject
                        to a different Privacy Policy.</p>
                    <br/>
                    <h4>Law enforcement</h4>
                    <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if
                        required to do so by law or in response to valid requests by public authorities (e.g. a court or
                        a government agency).</p>
                    <br/>
                    <h4>Other legal requirements</h4>
                    <p>The Company may disclose Your Personal Data in the good faith belief that such action is
                        necessary to:</p>
                    <ul>
                        <li>Comply with a legal obligation</li>
                        <li>Protect and defend the rights or property of the Company</li>
                        <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                        <li>Protect the personal safety of Users of the Service or the public</li>
                        <li>Protect against legal liability</li>
                    </ul>
                    <br/>
                    <h3>Security of Your Personal Data</h3>
                    <p>The security of Your Personal Data is important to Us, but remember that no method of
                        transmission over the Internet, or method of electronic storage is 100% secure. While We strive
                        to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its
                        absolute security.</p>
                    <br/>
                    <h2>Children's Privacy</h2>
                    <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                        identifiable information from anyone under the age of 13. If You are a parent or guardian and
                        You are aware that Your child has provided Us with Personal Data, please contact Us. If We
                        become aware that We have collected Personal Data from anyone under the age of 13 without
                        verification of parental consent, We take steps to remove that information from Our servers.</p>
                    <p>If We need to rely on consent as a legal basis for processing Your information and Your country
                        requires consent from a parent, We may require Your parent's consent before We collect and use
                        that information.</p>
                    <br/>
                    <h2>Links to Other Websites</h2>
                    <p>Our Service may contain links to other websites that are not operated by Us. If You click on a
                        third party link, You will be directed to that third party's site. We strongly advise You to
                        review the Privacy Policy of every site You visit.</p>
                    <p>We have no control over and assume no responsibility for the content, privacy policies or
                        practices of any third party sites or services.</p>
                    <br/>
                    <h2>Changes to this Privacy Policy</h2>
                    <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting
                        the new Privacy Policy on this page.</p>
                    <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change
                        becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy
                        Policy.</p>
                    <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this
                        Privacy Policy are effective when they are posted on this page.</p>
                    <br/>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                    <ul>
                        <li>By email: feedback@camra.me</li>
                    </ul>
              </div>
            </div>
          </div></Modal>


          <Modal isOpen={isOpen3} toggleOpen={toggleOpen3 }> 
          <div className="text-gray-900 flex justify-center" style={{width: 1050, marginLeft: -55 }}>
         <div className="bg-white flex justify-center flex-1 shadow sm:rounded-lg">
            <div className="   p-12 sm:p-12" style={{ maxHeight: '80vh', overflowY: 'auto' }}>                     <p className={"font-bold"}>Introduction</p>
                    Welcome to Camra.me! By accessing or using our website and app, you agree to comply with and be bound by these Terms of Service ("TOS"). Please read them carefully. If you do not agree with these terms, you should not use our services.
                    <p className={"font-bold"}>Account Creation</p>
                    Yes, users can create accounts. When you create an account, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    <p className={"font-bold"}>User-Generated Content</p>
                    Yes, users can create and/or upload content, including text and images. By submitting content, you grant Camra.me a non-exclusive, royalty-free, worldwide, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with our services.
                    <p className={"font-bold"}>Infringement Notices</p>
                    If you believe that any content on our site or app infringes your copyright or other intellectual property rights, please notify us at feedback@camra.me. Include a detailed description of the alleged infringement and your contact information.
                    <p className={"font-bold"}>In-App Purchases</p>
                    Yes, we offer in-app purchases. These may include digital goods, items, or services available for one-time purchase.
                    <p className={"font-bold"}>Goods and Services</p>
                    Yes, users can buy goods, items, or services through our platform. All purchases are one-time payments only.
                    <p className={"font-bold"}>Subscription Plans</p>
                    Yes, we offer subscription plans. Subscription plans may renew automatically unless canceled before the renewal date.
                    <p className={"font-bold"}>Free Trial</p>
                    Yes, we offer a free trial for certain services. The duration and terms of the free trial will be specified at the time of sign-up.
                    <p className={"font-bold"}>Proprietary Rights</p>
                    Yes, our content (logo, visual design, trademarks, etc.) is our exclusive property. You may not use any of our proprietary content without our prior written permission.
                    <p className={"font-bold"}>Feedback and Suggestions</p>
                    By submitting feedback or suggestions to us, you agree that we may use this feedback without any compensation or credits given to you.
                    <p className={"font-bold"}>Promotions, Contests, Sweepstakes</p>
                    Yes, we may offer promotions, contests, and sweepstakes. These activities will be governed by separate terms and conditions, which will be provided at the time of the event.
                    <p className={"font-bold"}>Contact Information</p>
                    If you have any questions regarding these Terms of Service, you can contact us by email at feedback@camra.me.
                    <p className={"font-bold"}>Changes to Terms of Service</p>
                    We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on our website and app. Your continued use of our services after any changes indicates your acceptance of the new terms.
                    <p className={"font-bold"}>Governing Law</p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Camra.me operates.
                    By using our website and app, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</div></div></div>
          </Modal>
    </div>
    
  );
};

export default Desktop;
