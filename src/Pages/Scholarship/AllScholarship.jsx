import React, { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router";

const AllScholarship = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 8; // Show 8 per page

  const {
    data: scholarships = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["scholarships", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (isError)
    return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;

  // Pagination logic
  const indexOfLast = currentPage * scholarshipsPerPage;
  const indexOfFirst = indexOfLast - scholarshipsPerPage;
  const currentScholarships = scholarships.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(scholarships.length / scholarshipsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <div className="max-w-10/12 mx-auto mt-21 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentScholarships.map((item) => (
          <div key={item._id} className="card bg-base-300 mx-auto shadow-lg">
            <img
              src={item.universityImage}
              alt={item.universityName}
              className="w-[400px] h-[300px] object-cover rounded-t-xl"
            />
            <div className="card-body">
              <h2 className="card-title">{item.universityName}</h2>
              <p><strong>Category:</strong> {item.scholarshipCategory}</p>
              <p><strong>Location:</strong> {item.city}, {item.country}</p>
              <p><strong>Deadline:</strong> {item.deadline}</p>
              <p><strong>Subject:</strong> {item.subjectCategory}</p>
              <p><strong>Application Fees:</strong> ${item.applicationFees}</p>
              <p><strong>Rating:</strong> ⭐ {item.rating}</p>
              <div className="card-actions justify-end mt-4">
                <Link to={`/scholarship/${item._id}`}>
                  <button className="btn btn-sm text-white bg-red-600 hover:bg-red-700">
                    Scholarship Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`btn btn-sm ${
              number === currentPage ? "btn text-white bg-red-600 hover:bg-red-700 font-semibold" : "btn-outline"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllScholarship;