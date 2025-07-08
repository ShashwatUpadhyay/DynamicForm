import React, {useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [Url,setUrl] = useState('/login')
  const [login,setLogin] = useState(false)
  const token = sessionStorage.getItem("authToken");
  useEffect(()=>{
    if (token){
      setUrl('/form');
      setLogin(true);
    }
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 p-6">
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4 text-center">
          Welcome to FormServe!
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Your journey to effortless form creation starts here. <span className="font-semibold text-purple-600">FormServe</span> empowers you to design, share, and analyze forms with ease and joy. Whether you're gathering feedback, running surveys, or organizing events, we've got you covered!
        </p>
        <p className="text-md text-gray-600 mb-8 text-center">
          <span className="font-bold text-pink-500">✨ Create. Share. Celebrate responses. ✨</span><br/>
          Join a community that loves simplicity and power, all in one beautiful platform.
        </p>
        <div className="flex gap-4 w-full justify-center">
          {login || 
          <button
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform duration-200"
            onClick={() => navigate(Url)}
          >
            Login
          </button>
          }
          <button
            className="px-6 py-3 bg-white border-2 border-pink-400 text-pink-500 rounded-full font-bold shadow-lg hover:bg-pink-50 hover:scale-105 transition-transform duration-200"
            onClick={() => navigate(Url)}
          >
            Get Started
          </button>
        </div>
        <div className="mt-10 text-center text-gray-400 text-sm">
          Made with <span className="text-pink-400">♥</span> for our amazing users. <br/> Let your forms shine!
        </div>
      </div>
    </div>
  );
};

export default Welcome; 