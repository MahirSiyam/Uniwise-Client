import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const TopScholarship = () => {
  const axiosSecure = useAxiosSecure();

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["topScholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships/top");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8">Top Scholarships</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((item) => (
          <div key={item._id} className="card bg-base-300 shadow-xl">
            <img
              src={item.universityImage}
              alt={item.universityName}
              className="h-[400px] w-[550px] object-cover rounded-t-lg"
            />
            <div className="card-body">
              <h2 className="card-title">{item.universityName}</h2>
              <p>
                <strong>Degree:</strong> {item.degree}
              </p>
              <p>
                <strong>Subject:</strong> {item.subjectCategory}
              </p>
              <p>
                <strong>Fees:</strong> ${item.applicationFees}
              </p>
              <p className="text-sm">
                <strong>Posted:</strong>{" "}
                {new Date(item.postDate).toDateString()}
              </p>
              <div className="card-actions justify-end">
                <Link
                  to={`/scholarship/${item._id}`}
                  className="btn bg-red-600 hover:bg-red-700 btn-sm text-white"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/allScholarship"
          className="btn bg-red-600 hover:bg-red-700 btn-md text-white"
        >
          View All Scholarships
        </Link>
      </div>
    </div>
  );
};

export default TopScholarship;
