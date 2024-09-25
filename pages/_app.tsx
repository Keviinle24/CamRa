
import '../styles/globals.css'
import '../styles/login.css';
import '../styles/Navbar.css';
import '../styles/Navbar1.css';
import type { AppProps } from 'next/app'


export const Modal = ({
  isOpen,
  toggleOpen,
 
  children
}) =>
  (
      <div className={
          `overlay ${
              isOpen ? "open" : ""
          }`
      }
      onClick={toggleOpen}
      >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
              {children}
          </div>
      </div>
  );

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
  
}
