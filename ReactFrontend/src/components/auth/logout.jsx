import React, { useEffect } from 'react';


const Logout = () => {

  useEffect(() =>{
    sessionStorage.removeItem("authToken");
    window.location.href = `/login`;
  })

  return (
    <div>
    </div>
  );
};

export default Logout; 