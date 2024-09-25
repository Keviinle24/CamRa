// function Error({ statusCode, message }) {
//     return (
//         <>
//             <div className="h-100 d-flex align-items-center justify-content-center">
//                 <div className={""}>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <br/>
//                     <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5">{statusCode}</h1>
//                     <h1 className="text-6xl text-white font-bold outfit-w700 mt-2 ml-5">{message}</h1>
//                     <a href={"https://www.instagram.com/officialcamra.me/"}>
//                         <div className={"d-flex align-items-center pl-5"} >
//                             <img width="32" alt="Instagram icon"
//                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/512px-Instagram_icon.png?20200512141346"/>
//                             <span className="text-white font-bold outfit-w200 ml-2"> @</span>
//                             <p className="text-white font-bold outfit-w200 underline-on-hover">officialcamra.me</p>

//                         </div>
//                     </a>

//                 </div>
//             </div>
//             <style jsx>{`
//                 @media screen and (max-width: 530px) {
//                     .text-6xl {
//                         font-size: 2.5rem; 
//                         margin-right: 1.3rem;
//                     }
//                 }
//             `}</style>
//         </>
// )
// }

// Error.getInitialProps = ({ res, err }) => {
//     const statusCode = res ? res.statusCode : err ? err.statusCode : 404
//     const message = res ? res.message : err ? err.json : "Page not found"
//     return { statusCode }
// }

// export default Error

// components/CustomErrorPage.js

// pages/_error.js
import CustomErrorPage from '../components/CustomErrorPage';

function Error({ statusCode }) {
    let message = "An unexpected error has occurred";

    switch (statusCode) {
        case 400:
            message = "Bad Request";
            break;
        case 403:
            message = "Forbidden";
            break;
        case 404:
            message = "Page Not Found";
            break;
        case 500:
            message = "Internal Server Error";
            break;
        case 429:
            message = "Too Many Requests";
            break;
     
    }

    return <CustomErrorPage statusCode={statusCode} message={message} />;
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

    // Redirect to /429 if 400 status or /500 if 403 status
    if (res && (statusCode === 400 || statusCode === 403)) {
        const redirectUrl = statusCode === 400 ? '/429' : '/500';
        res.writeHead(302, { Location: redirectUrl });
        res.end();
    }

    return { statusCode };
};

export default Error;

