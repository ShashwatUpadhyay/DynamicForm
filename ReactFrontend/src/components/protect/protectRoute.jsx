import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


export default function ProtectRoute({ children }) {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('authToken');

    useEffect(()=>{
        if(!token) navigate('/login');
    },[])
  return (
    children
  )
}
