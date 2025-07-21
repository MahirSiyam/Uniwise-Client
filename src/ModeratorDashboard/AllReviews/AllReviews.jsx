import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: reviews = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-reviews");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.delete(`/reviews/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "Review deleted successfully.", "success");
        refetch();
      } else {
        Swal.fire("Error!", "Failed to delete the review.", "error");
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">All Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="card bg-base-300 font-extralight shadow-xl border border-base-200 p-4 space-y-3"
          >
            <div className="flex items-center h-21 space-x-3">
              <img
                src={review.userImage}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-sm text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p>
              <strong>University:</strong> {review.universityName}
            </p>
            <p>
              <strong>Subject:</strong> {review.subjectCategory}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {review.rating}
            </p>
            <p>
              <strong>Comments:</strong> {review.comments}
            </p>
            <button
              className="btn bg-red-600 hover:bg-red-500 font-semibold text-white"
              onClick={() => handleDelete(review._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllReviews;
