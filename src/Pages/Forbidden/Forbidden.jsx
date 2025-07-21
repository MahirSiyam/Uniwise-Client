import { Link } from "react-router";
import forbidden from "../../assets/403 Error Forbidden-amico.svg";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <img className="w-[500px]" src={forbidden} alt="" />

      <h1 className="text-4xl font-bold text-red-600 mt-4">403 - Forbidden</h1>
      <p className="text-gray-600 mt-2 text-lg max-w-xl">
        You don’t have permission to access this page. Please contact the
        administrator or try logging in with appropriate credentials.
      </p>

      <Link to="/" className="mt-6">
        <button className="btn bg-red-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default Forbidden;