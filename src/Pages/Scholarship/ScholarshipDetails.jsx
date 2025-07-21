import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  console.log(id);

  const navigate = useNavigate();

  // Fetch a single scholarship using TanStack Query
  const {
    data: scholarship,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${id}`);
      return res.data;
    },
    enabled: !!id, // only fetch if id is present
  });

  if (isLoading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading scholarship details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load details: {error.message}
      </div>
    );
  }

  const handlePay = (id) => {
    console.log("proceed the payment", id);

    navigate(`/payment/${id}`, { state: scholarship });
  };

  return (
    <div className="card gap-5 lg:card-side mt-[117px] mb-[53px] max-w-10/12 bg-base-300 mx-auto rounded-none shadow-lg">
      <img
        className="w-[800px] h-auto object-cover"
        src={scholarship.universityImage}
        alt={scholarship.universityName}
      />
      <div className="flex items-center">
        <div className="space-y-5 p-5">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {scholarship.universityName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            {scholarship.city}, {scholarship.country}
          </p>
          <p>
            <strong>Category:</strong> {scholarship.scholarshipCategory}
          </p>
          <p>
            <strong>Subject:</strong> {scholarship.subjectCategory}
          </p>
          <p>
            <strong>Deadline:</strong> {scholarship.deadline}
          </p>
          <p>
            <strong>TuitionFees:</strong> {scholarship.tuitionFees || "N/A"}
          </p>
          <p>
            <strong>Service Charge:</strong> ${scholarship.serviceCharge}
          </p>
          <p>
            <strong>Application Fees:</strong> ${scholarship.applicationFees}
          </p>
          <p>
            <strong>Posted on:</strong>{" "}
            {new Date(scholarship.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Description:</strong>
            {scholarship.description}
          </p>
          <div className="card-actions justify-start">
            <button
              onClick={() => handlePay(scholarship._id)}
              className="w-auto bg-red-600 hover:bg-red-700 font-semibold text-white px-5 py-2 rounded mt-6 text-sm sm:text-base"
            >
              Apply Scholarship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetails;
