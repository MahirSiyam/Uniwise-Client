import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUserShield, FaEnvelope, FaUserTag, FaClock } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AdminMyProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: dbUser = {}, isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="w-full mt-12 px-6">
      <div className="bg-base-300 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img
            className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
            src={user?.photoURL || "/default-avatar.png"}
            alt="User Avatar"
          />
          <h2 className="text-3xl font-bold dark:text-base-content mb-1">
            {user?.displayName}
          </h2>
          <p className="text-blue-600 font-medium flex items-center gap-2">
            <FaEnvelope /> {user?.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full max-w-md text-left">
            <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow">
              <FaUserTag className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold text-gray-500">
                  {isLoading ? "Loading..." : dbUser?.role || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow">
              <FaClock className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-semibold text-gray-500">
                  {dbUser?.last_log_in
                    ? new Date(dbUser.last_log_in).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMyProfile;
