import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div className="flex gap-1 items-center text-2xl">
          <Link to="/" className="text-3xl font-extrabold dark:text-base-content">Uni<span className="text-3xl font-extrabold text-red-600">Wise</span></Link>
        </div>
    );
};

export default Logo;