import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import SocialLogin from "./SocialLogin";
import loginImage from "../../assets/login.png";

const LoginForm = () => {
  const { signIn, setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const user = result.user;

      await user.reload();
      const refreshedUser = user;

      setUser(refreshedUser);

      console.log(
        "Logged in user:",
        refreshedUser.displayName,
        refreshedUser.photoURL
      );
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="hero mt-16 min-h-screen">
      <div className="hero-content p-0 flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <img src={loginImage} alt="login" />
        </div>
        <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl font-bold mb-5">Login now!</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input"
                placeholder="Email"
              />
              {errors.email && (
                <p role="alert" className="text-red-600">
                  Email is required
                </p>
              )}

              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input"
                placeholder="Password"
              />
              {errors.password?.type === "required" && (
                <p role="alert" className="text-red-600">
                  Password is required
                </p>
              )}
              {errors.password?.type === "minLength" && (
                <p role="alert" className="text-red-600">
                  Password must be 6 characters or longer
                </p>
              )}

              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>

              <button className="btn bg-red-600 hover:bg-red-700 text-white font-bold">
                Login
              </button>
            </form>

            <p className="text-center text-sm mt-2">
              New to this website? Click{" "}
              <Link to="/register" className="text-red-600 font-semibold">
                Register here
              </Link>
            </p>

            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;