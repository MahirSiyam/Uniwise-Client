import axios from "axios";
import React, { use, useEffect } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const axiosSecure = axios.create({
  baseURL: `https://uniwise-server.vercel.app`,
});

const useAxiosSecure = () => {
  const { user } = use(AuthContext);

  useEffect(() => {
    if (user) {
      axiosSecure.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;