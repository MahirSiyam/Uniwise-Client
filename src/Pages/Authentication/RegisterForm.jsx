import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import registerImage from "../../assets/register.png";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxios from "../../Hooks/useAxios";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = use(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null); // "uploading", "success", "error"

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);

        // update userinfo in the database
        const userInfo = {
          displayName: data.name,
          email: data.email,
          role: "user",
          createdAt: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);

        // update user profile in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name puc updated");

            navigate(from, { replace: true });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
      setUploadStatus("success");
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadStatus("error");

      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Please try again or choose another image.",
      });
    }
  };

  return (
    <div className="hero mt-16 min-h-screen">
      <div className="hero-content p-0 flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <img src={registerImage} alt="Register" />
        </div>
        <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl font-bold mb-5">Register</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
              {/* Name */}
              <div>
                <label className="label">User Name</label>
                <input
                  type="text"
                  {...register("name", { required: "User name is required" })}
                  className="input "
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="input "
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                    validate: {
                      hasCapital: (value) =>
                        /[A-Z]/.test(value) || "Must include a capital letter",
                      hasSpecial: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        "Must include a special character",
                    },
                  })}
                  className="input "
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">User Profile Image</label>

                <div className="relative w-full">
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="btn btn-outline w-full cursor-pointer"
                  >
                    Choose Profile Image
                  </label>
                </div>

                {/* Upload Status */}
                {uploadStatus === "uploading" && (
                  <p className="text-blue-500 text-sm mt-2">
                    ⏳ Uploading image, please wait...
                  </p>
                )}
                {uploadStatus === "success" && (
                  <p className="text-green-500 text-sm mt-2">
                    ✅ Upload successful!
                  </p>
                )}
                {uploadStatus === "error" && (
                  <p className="text-red-500 text-sm mt-2">❌ Upload failed!</p>
                )}

                {/* Image Preview */}
                {profilePic && (
                  <img
                    src={profilePic}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2 border"
                  />
                )}
              </div>

              {/* Submit */}
              <button className="btn bg-red-600 hover:bg-red-700 text-white font-bold w-full">
                Register
              </button>
            </form>

            {/* Login Link */}
            <p className="text-sm mt-2 text-center">
              Already registered?{" "}
              <Link to="/login" className="text-red-600 font-semibold">
                Login here
              </Link>
            </p>

            {/* Social Login */}
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;