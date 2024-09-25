import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import Head from "next/head";
import { Modal } from './_app';
import EmailSignInForm from '../components/EmailSignInForm'
import styles from "/styles/Login.module.css";
import { AxiosError } from 'axios';
 

interface UserData {
  password: string;
  email: string;
  university: string;
}


const universities={
  "stanford.edu": "Stanford University",
      "mit.edu": "Massachusetts Institute of Technology",
      "harvard.edu": "Harvard University",
      "princeton.edu": "Princeton University",
      "caltech.edu": "California Institute of Technology",
      "berkeley.edu": "University of California, Berkeley",
      "yale.edu": "Yale University",
      "uchicago.edu": "University of Chicago",
      "jhu.edu": "Johns Hopkins University",
      "upenn.edu": "University of Pennsylvania",
      "columbia.edu": "Columbia University",
      "ucla.edu": "University of California, Los Angeles",
      "cornell.edu": "Cornell University",
      "umich.edu": "University of Michigan-Ann Arbor",
      "cmu.edu": "Carnegie Mellon University",
      "washington.edu": "University of Washington",
      "duke.edu": "Duke University",
      "northwestern.edu": "Northwestern University",
      "brown.edu": "Brown University",
      "notredame.edu": "University of Notre Dame",
      "vanderbilt.edu": "Vanderbilt University",
      "dartmouth.edu": "Dartmouth College",
      "rice.edu": "Rice University",
      "emory.edu": "Emory University",
      "unc.edu": "University of North Carolina at Chapel Hill",
      "wustl.edu": "Washington University in St. Louis",
      "georgetown.edu": "Georgetown University",
      "usc.edu": "University of Southern California",
      "universityoftexas.edu": "University of Texas at Austin",
      "uwmad.wisc.edu": "University of Wisconsin-Madison",
      "universityofvirginia.edu": "University of Virginia",
      "nyu.edu": "New York University",
      "tufts.edu": "Tufts University",
      "universityofflorida.edu": "University of Florida",
      "universityofmiami.edu": "University of Miami",
      "bostoncollege.edu": "Boston College",
      "ucdavis.edu": "University of California, Davis",
      "uwashington.edu": "University of Washington",
      "udel.edu": "University of Delaware",
      "gatech.edu": "Georgia Institute of Technology",
      "rpi.edu": "Rensselaer Polytechnic Institute",
      "case.edu": "Case Western Reserve University",
      "ucsd.edu": "University of California, San Diego",
      "ucsb.edu": "University of California, Santa Barbara",
      "umass.edu": "University of Massachusetts Amherst",
      "msu.edu": "Michigan State University",
      "osu.edu": "Ohio State University",
      "purdue.edu": "Purdue University",
      "uiuc.edu": "University of Illinois at Urbana-Champaign",
      "tamu.edu": "Texas A&M University",
      "ufl.edu": "University of Florida",
      "umd.edu": "University of Maryland",
      "clemson.edu": "Clemson University",
      "rutgers.edu": "Rutgers University",
      "psu.edu": "Pennsylvania State University",
      "usf.edu": "University of South Florida",
      "bu.edu": "Boston University",
      "uga.edu": "University of Georgia",
      "indiana.edu": "Indiana University Bloomington",
      "utk.edu": "University of Tennessee",
      "auburn.edu": "Auburn University",
      "okstate.edu": "Oklahoma State University",
      "txstate.edu": "Texas State University",
      "olemiss.edu": "University of Mississippi",
      "wayne.edu": "Wayne State University",
      "northeastern.edu": "Northeastern University",
      "kcl.ac.uk": "King's College London",
      "ox.ac.uk": "University of Oxford",
      "cam.ac.uk": "University of Cambridge",
      "imperial.ac.uk": "Imperial College London",
      "lse.ac.uk": "London School of Economics",
      "ucl.ac.uk": "University College London",
      "ed.ac.uk": "University of Edinburgh",
      "manchester.ac.uk": "University of Manchester",
      "warwick.ac.uk": "University of Warwick",
      "glasgow.ac.uk": "University of Glasgow",
      "bristol.ac.uk": "University of Bristol",
      "durham.ac.uk": "Durham University",
      "sheffield.ac.uk": "University of Sheffield",
      "bham.ac.uk": "University of Birmingham",
      "exeter.ac.uk": "University of Exeter",
      "york.ac.uk": "University of York",
      "nottingham.ac.uk": "University of Nottingham",
      "qub.ac.uk": "Queen's University Belfast",
      "sussex.ac.uk": "University of Sussex",
      "kuleuven.be": "KU Leuven",
      "ethz.ch": "ETH Zurich",
      "epfl.ch": "EPFL",
      "helsinki.fi": "University of Helsinki",
      "tcd.ie": "Trinity College Dublin",
      "ku.dk": "University of Copenhagen",
      "univie.ac.at": "University of Vienna",
      "unil.ch": "University of Lausanne",
      "polimi.it": "Politecnico di Milano",
      "unibo.it": "University of Bologna",
      "sciencespo.fr": "Sciences Po",
      "sorbonne-universite.fr": "Sorbonne University",
      "lu.se": "Lund University",
      "ugent.be": "Ghent University",
      "tu-dresden.de": "TU Dresden",
      "tu-berlin.de": "TU Berlin",
      "tum.de": "Technical University of Munich",
      "kit.edu": "Karlsruhe Institute of Technology",
      "uni-heidelberg.de": "University of Heidelberg",
      "uni-mannheim.de": "University of Mannheim",
      "uni-muenchen.de": "University of Munich",
      "uni-freiburg.de": "University of Freiburg",
      "uni-tuebingen.de": "University of Tuebingen",
      "unige.ch": "University of Geneva",
      "unibas.ch": "University of Basel",
      "tu-delft.nl": "Delft University of Technology",
      "uva.nl": "University of Amsterdam",
      "uu.nl": "Utrecht University",
      "rug.nl": "University of Groningen",
      "ucd.ie": "University College Dublin",
      "nuigalway.ie": "National University of Ireland Galway",
      "usw.edu.au": "University of New South Wales",
      "uq.edu.au": "University of Queensland",
      "unimelb.edu.au": "University of Melbourne",
      "utas.edu.au": "University of Tasmania",
      "anu.edu.au": "Australian National University",
      "adelaide.edu.au": "University of Adelaide",
      "curtin.edu.au": "Curtin University",
      "monash.edu.au": "Monash University",
      "deakin.edu.au": "Deakin University",
      "griffith.edu.au": "Griffith University",
      "latrobe.edu.au": "La Trobe University",
      "unisa.edu.au": "University of South Australia",
      "sydney.edu.au": "University of Sydney",
      "unsw.edu.au": "University of New South Wales",
      "nus.edu.sg": "National University of Singapore",
      "ntu.edu.sg": "Nanyang Technological University",
      "smu.edu.sg": "Singapore Management University",
      "suss.edu.sg": "Singapore University of Social Sciences",
      "sit.edu.sg": "Singapore Institute of Technology",
      "sutd.edu.sg": "Singapore University of Technology and Design",
      "nist.edu.sg": "National Institute of Education",
      "np.edu.sg": "Ngee Ann Polytechnic",
      "sp.edu.sg": "Singapore Polytechnic",
      "rp.edu.sg": "Republic Polytechnic",
      "uni.syndey.edu.au" : "University of Syndey",
      "albany.edu": "University at Albany, SUNY",
      "binghamton.edu": "Binghamton University, SUNY",
      "buffalo.edu": "University at Buffalo, SUNY",
      "stonybrook.edu": "Stony Brook University, SUNY",
      "buffalostate.edu": "SUNY Buffalo State",
      "uci.edu": "University Of California Irvine",
      "ucr.edu": "University Of California Riverside",
      "ucsc.edu": "University Of California Santa Cruz",
      "ucmerced.edu": "University Of California Merced",
      "mail.utoronto.ca": "University of Toronto",
      "student.ubc.ca": "University of British Columbia",
      "mail.mcgill.ca": "McGill University",
      "mail.mcmaster.ca": "McMaster University",
      "ualberta.ca": "University of Alberta",
      "umontreal.ca": "Université de Montréal",
      "uwaterloo.ca": "University of Waterloo",
      "uwo.ca": "Western University",
      "uottawa.ca": "University of Ottawa",
      "sfu.ca": "Simon Fraser University",
      "dal.ca": "Dalhousie University",
      "ulaval.ca": "Université Laval",
      "uvic.ca": "University of Victoria",
      "mail.concordia.ca": "Concordia University",
      "carleton.ca": "Carleton University",
      "vt.edu" : "Virginia Tech",
      "farmingdale.edu" : "SUNY Farmingdale",
    
}

const logo = '/public/FinalLogo4.png'

function Register() {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendVisible, setResendVisible] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const MAX_RESEND_ATTEMPTS = 2;
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
 
    return (email.toLowerCase().split('@')[1] in universities && re.test(email) && email.replace(/[^@]/g, "").length === 1);
  };


  useEffect(() => {  //delete when backend implemented
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }         else if (resendAttempts < MAX_RESEND_ATTEMPTS) {
      setResendVisible(true);
    }
  }, [countdown, resendAttempts]);
 
 

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const onEmailChange = (e) => {
    if (e.target.value.toLowerCase().split('@')[1] in universities){
      setUniversity(universities[e.target.value.toLowerCase().split('@')[1]]);
    } else{
      setUniversity("");
    }
    setEmail(e.target.value);
  }

  const internetImageURL = '/public/top.png';
  
  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleOpen2 = () => setIsOpen2(!isOpen2);
  const toggleOpen3 = () => setIsOpen3(!isOpen3);
  const handleResend = async () => {
    try {
      toggleOpen();
      await axios.post('/api/resend-verification', { email });
      
      // Update resend attempts using the functional form
      setResendAttempts(prevAttempts => prevAttempts + 1);
  
      // Reset countdown
      setCountdown(90); 
    } catch (error) {
      console.error("Failed to resend email:", error);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };
          
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all mandatory paramters");    
    
      return;
  }
  if (password.length>100||password.length<4) {
    alert("Password must be 4-100 characters long");
    return;
  }
  if (email.length>30||email.length<4) {
    alert("Email must be 4-30 characters long")
  }
  if (!validateEmail(email)) {
    alert("Sorry! CamRa isn't available for your university yet. Email us at feedback@camra.me and we can get working on adding it!");
    return;
  }

      try {
        const data= {
          password: password ,
          email: email,
          university: university};
        const response = await axios.post('/api/register', data);
      
       
      //   if (response.status === 429) {
      //     setIsOpen2(isOpen2);
      //     toggleOpen2();
      // }
         if (response.status === 200) {
     
          toggleOpen();
          useEffect(() => {
            if (countdown > 0) {
              const timer = setTimeout(() => setCountdown(countdown - 1), 9000);
              return () => clearTimeout(timer);
            }
          }, [countdown]);
   
            router.push('/login');
        }
    } catch (error) {
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
            alert('Email has already been registered');
          }
        } 
      }
  }}

 


const contentWrapperStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  maxWidth: '1200px',
  padding: '20px',
  textAlign: 'left',
  marginTop: '80px',
  gap: '60px'
};

 
const styles = {
  container: {
    minHeight: '100vh',
 
    justifyContent: 'center',
    alignItems: 'center',
    // background: 'radial-gradient(circle, #2A336A,  #061B31)',
    background: 'white',
    backgroundSize: 'cover', // Adjusted to cover the container
    // backgroundSize: '300% 300%',
    animation: 'color 20s ease-in-out infinite',
  },
  content: {
    maxWidth: '1300px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '7px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, .7)',


  },
  textBlack: {
    color: '#000000', // Black color
  },
};

return (
  
  <div style={styles.container}>
      
         <style jsx>{`
          
@media screen and (max-width: 2560px) {
  .text-white {
    font-size: 2rem; 
    
  }
  .text-6xl {
    font-size: 5.1rem; 
  } 
  .text-xl {
    font-size: 1rem; 
    margin-left: 70px;
  }

 

  .curve {
    margin-left: 240px;
    width: 190px;
  }
  .slideShow {
  margin-bottom: 420px
  }
}

/* For screens 1920px and smaller */
@media screen and (min-width: 1920px) {
  .text-white {
    font-size: 2rem; 
    
  }
  .text-6xl {
    font-size: 5.7rem; 
  }
  .instagram {
   width: 80%;
   height: 80%;
  }  
  .text-4xl {
margin-left: 280px;
margin-bottom: 0px;
margin-top: -40px;
font-size: 3.5rem;

  } 

 

  .inline-block {
 font-size: 1rem;
 margin-left: -157px;
 }
 .button {
 font-size: 1.5rem;
 width: 350px;
  height: 73px;
 }
  .button1{
   font-size: 1.5rem;
  width:350px;
  height: 73px;
   margin-left: 410px;
    margin-top: -73px; 
  }
}
            //  @media screen and (max-width: 430px) {
            //   .text-5xl {
            //     font-size: 2rem; /* Example smaller font size */
            //   }
            //   .text-6xl {
            //     font-size: 2.5rem; /* Example smaller font size */
            //   }
            //   .text-xl {
            //     font-size: 1rem; /* Example smaller font size */
            //   }
            //   .curve {
            //     margin-left: -60px;
            //     width: 150px;
            //   }
            // }

    
          `}</style>

  <Head>
    <title>CamRa</title>
    <link rel="icon" href="/public/FinalLogo10.png" />
  </Head>

  <div className="flex h-screen">
    <div className="w-1/2 flex items-center justify-center" style={{ backgroundColor: 'var(--color-gray-100)' }}>
      <div className="flex-1 justify-center">
        <div className="sm:p-12">
          <div>
            <div>
              <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5"   style={{
    backgroundImage: 'linear-gradient(90deg, #00fff0, #ff00f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
              >spontaneous video</h1>
              <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5">calling made</h1>
              <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5">different</h1>

              <a href="https://www.instagram.com/officialcamra.me/"  target="_blank">
                <div className="instagram flex items-center pl-5 mt-4">
                <img
  alt="Instagram icon"
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/512px-Instagram_icon.png?20200512141346"
  style={{ width: '8%', height: '8%' }} // Adjust the percentage as needed
/>

                  <p className="text-white font-bold outfit-w200 underline-on-hover ml-2 mt-3.5" >
                    @officialcamra.me
                  </p>
                </div>
              </a>
            </div>
          </div>
  </div>
</div>
     
        </div>
      
        <div className="max-w-lg flex h-screen items-center justify-center ">
       

          <div className="w-full flex-1 " style={{margin: 206}}>
            <div className="mx-auto max-w-xs">
    
            <h1 className=" text-4xl  xl:text-5xl font-bold" style={{marginBottom: '13%',marginLeft: '73.5%', fontFamily: 'Josefin Sans', color: '#000000'}}>Register</h1>
              <form onSubmit={onSubmit}>
                                <input
                  className="  px-3 py-5 rounded  font-medium bg-white border border-black placeholder-gray-500  text-black text-sm focus:outline-none   mt-5"
                  placeholder='College Email'
                  id="email"
                  type="email"
                  value={email}
                  onChange={onEmailChange}
                  autoComplete="off"
                  style={{ width: '200%' }} 
                  onKeyDown={handleKeyDown}
                />
                <input
                  className="  px-3 py-5 rounded font-medium bg-white border border-black placeholder-gray-500 text-black  text-sm focus:outline-none   mt-10"
                  placeholder='Password'
                  id="password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  autoComplete="off"
                  style={{  width: '200%' }} 
                  onKeyDown={handleKeyDown}
                />

<input
  className="disabled:opacity-75 px-3 py-5 rounded font-medium bg-white border border-black text-black placeholder-gray-500 text-sm focus:outline-none mt-10"
  placeholder={university ? university : "University"} // Show the placeholder only when the university is empty
  style={{ width: '200%' }}
  readOnly={true}
  value={university} // Ensure it defaults to an empty string when university is not set
/>
<Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        <div className="text-gray-900 flex justify-center">
          <div className="bg-white flex-1 flex justify-center shadow sm:rounded-lg" style={{ maxWidth: 500 }}>
            <div className="sm:p-12">
           
            
              <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold" style={{  fontFamily: 'Josefin Sans', marginTop: '0px', backgroundImage: 'linear-gradient(90deg, #00fff0, #ff00f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent' }}>Verify Your Email Address</h1>
                <div className='text-center' style={{ fontFamily: 'Josefin Sans', lineHeight: '23px', fontSize: '18px', marginTop: '15px'}}>A verification email has been sent to you email. Please wait up to 5 minutes for the email to be sent to your inbox before trying to resend. </div>
                <div className="text-center" style={{ fontFamily: 'Josefin Sans', marginTop: '20px', fontWeight: 600, fontSize: 20, marginBottom: '-10px'}}>
                  {resendAttempts >= MAX_RESEND_ATTEMPTS ? (
                    <span>Please try a different email or email us at verify@camra.me for support.</span>
                  ) : resendVisible ? (
                    <button className='text-blue-500'
                      onClick={handleResend}
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Resend verification email
                    </button>
                  ) : (
                    `A verification email has been sent to your email. Verification email will resend in ${countdown}s.`
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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


              {error && <p className="mt-3 text-red-500">{error}</p>}
              <p className="mt-6 text-xs text-gray-600   "           style={{ width: '540px' }} >
                By continuing, I agree to Video Stream{"'s "}
                <a href="#" className="border-b border-gray-500 border-dotted" onClick={toggleOpen3}>
                  Terms of Service{' '}
                </a>
                and its{' '}
                <a href="#" className=" border-b border-gray-500 border-dotted" onClick={toggleOpen2}>
                  Privacy Policy
                </a>
              </p>
              <div className="text-center flex    ">
              
                  <p className="    text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"  style={{marginLeft:'-73px',  width: '540px' }}  >
                  <Link href="/login" passHref>  Already have an account? Login </Link>
                 </p>
      
    
       
                <Link href="/login" passHref> <button
       
                  className="   font-semibold bg-black text-gray-100  py-6 rounded-full  hover:bg-indigo-700 transition-all duration-300 ease-in-out flex   items-center justify-center "     style={{ fontSize: '22px', marginLeft: '-530%', fontFamily: 'Josefin Sans' ,  width: '600%', marginTop: '145%'  }} 
                > 
                Back
                </button></Link>    </div>
                <button
                  type = "submit"
                
                  className="    font-semibold bg-black text-gray-100   py-6 rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"     style={{ fontSize: '22px', fontFamily: 'Josefin Sans',  marginTop: '-22%' ,marginLeft: '110%', width: '90%'  }} 
                >
                Register
                </button>
                </form>  
              </div>
            </div>
          </div>
        </div>
      </div>
   
   

);
}

export default Register;

