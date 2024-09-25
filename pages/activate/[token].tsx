import { useRouter } from 'next/router'
import axios from "axios";

export default function Page() {
    const router = useRouter()
    axios.get(`/api/activate/${router.query.token}`)
        .then((response) => {
            if (response.status === 200) {
                router.push('/');
            }
        })
        .catch((error) => {
            return <p>Error: {error.message}</p>;
        });
    return  <div style={{ backgroundColor: 'var(--color-gray-100)' }} className="flex items-center justify-center min-h-screen"> <p
      className='text-6xl font-bold outfit-w0 '
      style={{
     height: 100,
        backgroundImage: 'linear-gradient(90deg, #00fff0, #ff00f5)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      Verifying in progress...
    </p>
  </div>
}

