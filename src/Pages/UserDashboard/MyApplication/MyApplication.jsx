import React, { useState, use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import Swal from "sweetalert2";
import { FaInfoCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthProvider";

const MyApplication = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModalData, setReviewModalData] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const [editModalData, setEditModalData] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["myApplications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applied?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const closeModal = () => setSelectedApp(null);

  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/applied/${id}`);
          if (res.data.success) {
            Swal.fire("Canceled!", "The application has been deleted.", "success");
            queryClient.invalidateQueries(["myApplications", user?.email]);
          } else {
            Swal.fire("Error", "Could not delete the application.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong.", error);
        }
      }
    });
  };

  const handleEditOpen = (app) => {
    setEditModalData(app);
    setEditForm({
      phone: app.phone || "",
      ssc: app.ssc || "",
      hsc: app.hsc || "",
      address: app.address || "",
    });
    document.getElementById("edit_modal").showModal();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      userEmail: user.email,
      userName: user.displayName,
      userImage: user.photoURL,
      scholarshipId: reviewModalData.scholarshipId,
      scholarshipName: reviewModalData.scholarshipCategory,
      universityName: reviewModalData.universityName,
      subjectCategory: reviewModalData.subjectCategory,
      comments: reviewText,
      rating: parseInt(rating),
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/reviews", reviewData);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Review submitted.", "success");
        document.getElementById("review_modal").close();
        setReviewModalData(null);
        setReviewText("");
        setRating(5);
      } else {
        Swal.fire("Error", "Could not save the review.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editModalData.status !== "pending") {
      Swal.fire("Not Allowed", "Only pending applications can be edited.", "info");
      return;
    }
    try {
      const res = await axiosSecure.patch(`/applied/${editModalData._id}`, editForm);
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated", "Application updated successfully", "success");
        document.getElementById("edit_modal").close();
        setEditModalData(null);
        queryClient.invalidateQueries(["myApplications", user?.email]);
      } else {
        Swal.fire("No Change", "No fields were modified.", "info");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", error);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">My Applications</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead className="bg-base-200">
            <tr>
              <th>University</th>
              <th>Address</th>
              <th>Feedback</th>
              <th>Subject</th>
              <th>Degree</th>
              <th>Fees</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.universityName}</td>
                <td>{app.address}</td>
                <td>{app.feedback || "N/A"}</td>
                <td>{app.subjectCategory}</td>
                <td>{app.degree}</td>
                <td>৳{app.amountPaid}</td>
                <td>
                  <span
                    className={`badge text-xs ${
                      app.status === "Rejected"
                        ? "badge-error"
                        : app.status === "completed"
                        ? "badge-success"
                        : app.status === "processing"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {app.status || "pending"}
                  </span>
                </td>
                <td className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="btn btn-outline btn-xs tooltip"
                    data-tip="Details"
                  >
                    <FaInfoCircle />
                  </button>
                  <button
                    className="btn btn-outline btn-xs tooltip"
                    data-tip="Edit"
                    onClick={() => handleEditOpen(app)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-outline btn-error btn-xs tooltip"
                    data-tip="Cancel"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => {
                      setReviewModalData(app);
                      setReviewText("");
                      document.getElementById("review_modal").showModal();
                    }}
                    className="btn btn-success btn-outline btn-xs"
                  >
                    Add Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <ApplicationDetailsModal isOpen={!!selectedApp} onClose={closeModal}>
        {selectedApp && (
          <>
            <h3 className="font-bold text-lg mb-2">{selectedApp.universityName}</h3>
            <p><strong>Address:</strong> {selectedApp.address}</p>
            <p><strong>Subject:</strong> {selectedApp.subjectCategory}</p>
            <p><strong>Degree:</strong> {selectedApp.degree}</p>
            <p><strong>Application Fees:</strong> ৳{selectedApp.applicationFees}</p>
            <p><strong>Service Charge:</strong> ৳{selectedApp.serviceCharge}</p>
            <p><strong>Total Paid:</strong> ৳{selectedApp.amountPaid}</p>
            <p><strong>Status:</strong> {selectedApp.status || "pending"}</p>
            <p><strong>Phone:</strong> {selectedApp.phone}</p>
            <p><strong>SSC Result:</strong> {selectedApp.ssc}</p>
            <p><strong>HSC Result:</strong> {selectedApp.hsc}</p>
            <p><strong>Applied At:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
          </>
        )}
      </ApplicationDetailsModal>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Edit Application Info</h3>
          {editModalData && (
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="input input-bordered w-full"
                disabled={editModalData.status !== "pending"}
                placeholder="Phone"
              />
              <input
                type="text"
                value={editForm.ssc}
                onChange={(e) => setEditForm({ ...editForm, ssc: e.target.value })}
                className="input input-bordered w-full"
                disabled={editModalData.status !== "pending"}
                placeholder="SSC Result"
              />
              <input
                type="text"
                value={editForm.hsc}
                onChange={(e) => setEditForm({ ...editForm, hsc: e.target.value })}
                className="input input-bordered w-full"
                disabled={editModalData.status !== "pending"}
                placeholder="HSC Result"
              />
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="textarea textarea-bordered w-full"
                disabled={editModalData.status !== "pending"}
                placeholder="Address"
              ></textarea>

              <div className="modal-action">
                {editModalData.status === "pending" && (
                  <button type="submit" className="btn btn-sm btn-primary">
                    Update
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("edit_modal").close();
                    setEditModalData(null);
                  }}
                  className="btn btn-sm"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Submit Your Review</h3>
          {reviewModalData && (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <input type="text" value={reviewModalData.universityName} readOnly className="input input-bordered w-full" />
              <input type="text" value={reviewModalData.scholarshipCategory} readOnly className="input input-bordered w-full" />
              <input type="text" value={reviewModalData.subjectCategory} readOnly className="input input-bordered w-full" />
              <textarea
                rows="4"
                placeholder="Write your review here..."
                className="textarea textarea-bordered w-full"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
              <input
                type="number"
                min="1"
                max="5"
                className="input input-bordered w-full"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
              <div className="modal-action">
                <button type="submit" className="btn btn-sm btn-primary">
                  Submit Review
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    document.getElementById("review_modal").close();
                    setReviewModalData(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default MyApplication;
