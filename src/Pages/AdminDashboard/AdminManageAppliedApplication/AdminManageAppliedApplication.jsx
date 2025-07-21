import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaInfoCircle,
  FaCommentDots,
  FaTrashAlt,
} from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllAppliedScholarship = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // State for modals
  const [detailsApp, setDetailsApp] = useState(null);
  const [feedbackApp, setFeedbackApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [filterType, setFilterType] = useState("default"); // For sorting/filtering

  // Fetch applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applied");
      return res.data;
    },
  });

  // Mutation to update application status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/applied/status/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Updated!", "Status has been updated.", "success");
      queryClient.invalidateQueries(["allApplications"]);
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong.", "error");
    },
  });

  // Mutation to update feedback
  const updateFeedback = useMutation({
    mutationFn: async ({ id, feedback }) => {
      const res = await axiosSecure.patch(`/applied/feedback/${id}`, {
        feedback,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Feedback submitted successfully.", "success");
      queryClient.invalidateQueries(["allApplications"]);
      setFeedbackApp(null);
      setFeedbackText("");
    },
    onError: () => {
      Swal.fire("Error", "Failed to submit feedback.", "error");
    },
  });

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  // Confirm cancel (reject) application
  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Canceling will reject the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus.mutate({ id, status: "Rejected" });
      }
    });
  };

  // Open feedback modal
  const openFeedbackModal = (app) => {
    setFeedbackApp(app);
    setFeedbackText(app.feedback || "");
  };

  // Submit feedback form
  const submitFeedback = (e) => {
    e.preventDefault();
    updateFeedback.mutate({ id: feedbackApp._id, feedback: feedbackText });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  // Sort applications based on filterType
  const sortedApplications = [...applications].sort((a, b) => {
    if (filterType === "appliedDate") {
      // Sort descending by appliedDate (newest first)
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    }
    if (filterType === "deadline") {
      // Sort ascending by scholarshipDeadline (soonest first)
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0; // Default order (no sorting)
  });

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-4">
        All Applied Scholarships
      </h2>

      {/* Sorting/Filtering dropdown */}
      <div className="flex justify-center my-4">
        <select
          className="select select-bordered"
          onChange={(e) => setFilterType(e.target.value)}
          defaultValue=""
        >
          <option value="default">Filter: Default</option>
          <option value="appliedDate">Sort by Applied Date (Newest)</option>
          <option value="deadline">Sort by Scholarship Deadline (Nearest)</option>
        </select>
      </div>

      <table className="table w-full text-sm">
        <thead className="bg-base-300">
          <tr>
            <th>Student Name</th>
            <th>Student Email</th>
            <th>Scholarship</th>
            <th>University</th>
            <th>Subject</th>
            <th>AppliedAt</th>
            <th>Deadline</th>
            <th>Amount Paid</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Details</th>
            <th>Feedback</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {sortedApplications.map((app) => (
            <tr key={app._id}>
              <td>{app.userName}</td>
              <td>{app.userEmail}</td>
              <td>{app.scholarshipCategory}</td>
              <td>{app.universityName}</td>
              <td>{app.subjectCategory}</td>
              <td>{app.appliedAt}</td>
              <td>{app.deadline}</td>
              <td>৳{app.amountPaid}</td>
              <td>
                <span
                  className={`badge ${
                    app.status === "completed"
                      ? "badge-success"
                      : app.status === "processing"
                      ? "badge-warning"
                      : app.status === "Rejected"
                      ? "badge-error"
                      : "badge-info"
                  }`}
                >
                  {app.status || "pending"}
                </span>
              </td>
              <td>
                <select
                  value={app.status || "pending"}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="select select-sm select-bordered"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => setDetailsApp(app)}
                  className="btn btn-outline btn-xs tooltip"
                  data-tip="Details"
                >
                  <FaInfoCircle />
                </button>
              </td>
              <td>
                <button
                  onClick={() => openFeedbackModal(app)}
                  className="btn btn-outline btn-xs tooltip"
                  data-tip="Feedback"
                >
                  <FaCommentDots />
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleCancel(app._id)}
                  className="btn btn-outline btn-error btn-xs tooltip"
                  data-tip="Cancel"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Modal */}
      {detailsApp && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              onClick={() => setDetailsApp(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
              title="Close"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-3">Application Details</h3>
            <p>
              <strong>University:</strong> {detailsApp.universityName}
            </p>
            <p>
              <strong>Degree:</strong> {detailsApp.degree}
            </p>
            <p>
              <strong>Scholarship Category:</strong>{" "}
              {detailsApp.scholarshipCategory}
            </p>
            <p>
              <strong>Subject Category:</strong> {detailsApp.subjectCategory}
            </p>
            <p>
              <strong>Status:</strong> {detailsApp.status || "pending"}
            </p>
            <p>
              <strong>Feedback:</strong>{" "}
              {detailsApp.feedback || "No feedback yet."}
            </p>
            <p>
              <strong>Applied Date:</strong>{" "}
              {detailsApp.appliedAt
                ? new Date(detailsApp.appliedAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Scholarship Deadline:</strong>{" "}
              {detailsApp.deadline
                ? new Date(detailsApp.deadline).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackApp && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              onClick={() => setFeedbackApp(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
              title="Close"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-3">Provide Feedback</h3>
            <form onSubmit={submitFeedback}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter feedback here"
                required
                rows={5}
              />
              <button type="submit" className="btn btn-primary mt-3">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppliedScholarship;
