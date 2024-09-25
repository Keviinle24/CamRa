import Link from 'next/link'; 
export default function CustomErrorPage({ statusCode, message }) {
    return (
        <>
            <div className="h-100 d-flex align-items-center justify-content-center page-container">
       
                <div className="">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5">
                        {statusCode}: {message}
                    </h1>
                    
                    <a href ="https://www.instagram.com/officialcamra.me/" target='blank'> 
                    
                        <div className="flex mt-4 pl-5">
                        
                            <img
                                width="35"
                                alt="Instagram icon"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/512px-Instagram_icon.png?20200512141346"
                            />
                            
                            <p className="text-white font-bold outfit-w200 underline-on-hover mt-4">
                                @officialcamra.me
                            </p>
                        </div> </a>
                        <div className="home-button  pl-5">
                        <Link href="/">
                        <div className="home-link  font-bold   mt-5    rounded-full text-white  " style={{ padding: '20px'}}>Home </div>
                    </Link>
                    </div>
                  
                </div>
            </div>
            <style jsx>{`
                .page-container {
                    background-color: var(--color-gray-100);
                    min-height: 100vh;
                    width: 100%;
                }

                .home-link {
                 background: linear-gradient(90deg, #00fff0, #ff00f5 );
                 width: 87px;
                 font-size: 20px
                 margin-right: 30px;
                }

                @media screen and (max-width: 530px) {
                    .text-6xl {
                        font-size: 2.5rem;
                        margin-right: 1.3rem;
                    }
                }
            `}</style>
        </>
    );
}
