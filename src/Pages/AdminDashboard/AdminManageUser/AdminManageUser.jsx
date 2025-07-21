import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AdminManageUser = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRole, setSelectedRole] = useState("");

  const {
    data: usersData = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", selectedRole],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?role=${selectedRole}`);
      return res.data;
    },
  });

  const handleRoleChange = async (id, newRole) => {
    await axiosSecure.patch(`/users/role/${id}`, { role: newRole });
    refetch();
    Swal.fire("Success", "Role updated", "success");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      await axiosSecure.delete(`/users/${id}`);
      refetch();
      Swal.fire("Deleted!", "User has been removed.", "success");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <select
          className="select select-bordered"
          onChange={(e) => setSelectedRole(e.target.value)}
          defaultValue=""
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update Role</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.map((usersData, index) => (
              <tr key={usersData._id}>
                <td>{index + 1}</td>
                <td>{usersData.displayName || "N/A"}</td>
                <td>{usersData.email}</td>
                <td className="capitalize">{usersData.role}</td>
                <td>
                  <select
                    className="select select-sm select-bordered"
                    value={usersData.role}
                    onChange={(e) =>
                      handleRoleChange(usersData._id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(usersData._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Failed to load users</p>}
      </div>
    </div>
  );
};

export default AdminManageUser;
