import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaInfoCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Fetch all scholarships
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["all-scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  // Edit handler
  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    reset(scholarship);
    setEditModalOpen(true);
  };

  // Details handler
  const handleDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailsModalOpen(true);
  };

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(
        `/scholarships/${selectedScholarship._id}`,
        updatedData
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-scholarships"]);
      setEditModalOpen(false);
      Swal.fire("Updated!", "Scholarship updated successfully!", "success");
    },
  });

  const onSubmit = (data) => {
    const { _id, ...updateData } = data;
    updateMutation.mutate(updateData);
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/scholarships/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-scholarships"]);
      Swal.fire("Deleted!", "Scholarship deleted successfully!", "success");
    },
  });

  //   // Submit update
  //   const onSubmit = (data) => {
  //     updateMutation.mutate(data);
  //   };

  // Delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Scholarships</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>University</th>
                <th>Category</th>
                <th>Degree</th>
                <th>Deadline</th>
                <th>Fees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((sch) => (
                <tr key={sch._id}>
                  <td>{sch.scholarshipName}</td>
                  <td>{sch.universityName}</td>
                  <td>{sch.subjectCategory}</td>
                  <td>{sch.degree}</td>
                  <td>{sch.deadline}</td>
                  <td>${sch.applicationFees}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleDetails(sch)}
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(sch)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(sch._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Scholarship</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("scholarshipName")}
                placeholder="Scholarship Name"
                className="input input-bordered w-full"
              />
              <input
                {...register("universityName")}
                placeholder="University Name"
                className="input input-bordered w-full"
              />
              <input
                {...register("subjectCategory")}
                placeholder="Subject Category"
                className="input input-bordered w-full"
              />
              <input
                {...register("degree")}
                placeholder="Degree"
                className="input input-bordered w-full"
              />
              <input
                {...register("applicationFees")}
                type="number"
                placeholder="Application Fees"
                className="input input-bordered w-full"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Scholarship Details</h2>
            <p>
              <strong>Name:</strong> {selectedScholarship.scholarshipName}
            </p>
            <p>
              <strong>University:</strong> {selectedScholarship.universityName}
            </p>
            <p>
              <strong>Category:</strong> {selectedScholarship.subjectCategory}
            </p>
            <p>
              <strong>Degree:</strong> {selectedScholarship.degree}
            </p>
            <p>
              <strong>Fees:</strong> ${selectedScholarship.applicationFees}
            </p>
            <p>
              <strong>Description</strong>
              {selectedScholarship.description}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="btn"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;