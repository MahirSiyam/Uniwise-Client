import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';

const PrivateRoute = ({children}) => {

    const {user , loading} = use(AuthContext);

    const location = useLocation()
    // console.log(location);

    if(loading)
    {
        return <div className='max-h-screen flex justify-center items-center mt-35 mb-35'>
                  <span className="loading loading-bars loading-xl"></span>
               </div>
    }

    if(user && user?.email)
    {
        return children;
    }
    else
    {
        return <Navigate state={{from: location.pathname}} to={`/login`}></Navigate>
    }
};

export default PrivateRoute;