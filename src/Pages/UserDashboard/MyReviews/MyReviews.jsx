import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyReviews = () => {
  const { user } = React.useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userReviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const [editReview, setEditReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: "",
    comments: "",
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure to delete?");
    if (confirm) {
      await axiosSecure.delete(`/reviews/${id}`);
      refetch();
    }
  };

  const openEditModal = (review) => {
    setEditReview(review);
    setFormData({
      rating: review.rating,
      comments: review.comments,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.put(`/reviews/${editReview._id}`, {
        rating: formData.rating,
        comments: formData.comments,
      });
      Swal.fire("Success", "Review updated successfully!", "success");
      setEditReview(null);
      refetch();
    } catch (err) {
      Swal.fire("Error", "Failed to update review.", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Scholarship ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>{review.scholarshipId}</td>
              <td>{review.rating}</td>
              <td>{review.comments}</td>
              <td>{new Date(review.date).toLocaleDateString()}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => openEditModal(review)}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Review Modal */}
      {editReview && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-lg">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setEditReview(null)}
              title="Close"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Review</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Rating</label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  required
                  className="textarea textarea-bordered w-full"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Update Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
