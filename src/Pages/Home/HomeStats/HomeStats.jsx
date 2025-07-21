import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUsers, FaUniversity, FaStar } from "react-icons/fa";

const HomeStats = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["homeStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading stats...</p>;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="   text-3xl font-bold text-center mb-8">Platform Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-base-300 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
          <FaUsers className="text-4xl text-blue-600 mb-3" />
          <h3 className="text-3xl font-bold text-blue-700">{data.totalUsers}</h3>
          <p className=" font-semibold mt-2">Total Users</p>
        </div>

        {/* Total Scholarships */}
        <div className="bg-base-300 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
          <FaUniversity className="text-4xl text-green-600 mb-3" />
          <h3 className="text-3xl font-bold text-green-700">{data.totalScholarships}</h3>
          <p className=" font-semibold mt-2">Total Scholarships</p>
        </div>

        {/* Total Reviews */}
        <div className="bg-base-300 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
          <FaStar className="text-4xl text-yellow-500 mb-3" />
          <h3 className="text-3xl font-bold text-yellow-600">{data.totalReviews}</h3>
          <p className=" font-semibold mt-2">Total Reviews</p>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
