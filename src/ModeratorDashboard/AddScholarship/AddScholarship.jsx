import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddScholarship = () => {
  const { user } = use(AuthContext);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const imgbbAPIKey = "012958474081529053da65ff0d4ec690";

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    setUploading(true);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        formData
      );
      const url = res.data.data.url;
      setImageUrl(url);
      setValue("universityImage", url);
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      data.createdBy = user?.email || "unknown";
      data.createdAt = new Date().toISOString();
      data.rating = parseFloat(data.rating);

      // Optional extras
      data.status = "pending";

      // console.log("Scholarship Data:", data);

      axiosSecure.post(`/scholarships`, data).then((res) => {
        // console.log(res.data);
        if (res.data.insertedId) {

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Scholarship submitted successfully.",
            confirmButtonColor: "#e7000b",
          });
        }
      });

      reset();
      setImageUrl("");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="my-10 p-5 ml-5 bg-base-300 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-base-content">
        Add Scholarship
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="label">Scholarship Name</label>
          <input
            {...register("scholarshipName", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">University Name</label>
          <input
            {...register("universityName", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">University Country</label>
          <input
            {...register("country", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">University City</label>
          <input
            {...register("city", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">World Rank</label>
          <input
            {...register("worldRank", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Subject Category</label>
          <select
            {...register("subjectCategory", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Engineering">Engineering</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>

        <div>
          <label className="label">Scholarship Category</label>
          <select
            {...register("scholarshipCategory", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Full fund">Full-fund</option>
            <option value="Partial">Partial</option>
            <option value="Self-fund">Self-fund</option>
          </select>
        </div>

        <div>
          <label className="label">Degree</label>
          <select
            {...register("degree", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
            <option value="Masters">PhD</option>
          </select>
        </div>

        <div>
          <label className="label">Tuition Fees (optional)</label>
          <input
            {...register("tuitionFees")}
            className="input input-bordered w-full"
            type="number"
          />
        </div>

        <div>
          <label className="label">Application Fees</label>
          <input
            {...register("applicationFees", { required: true })}
            className="input input-bordered w-full"
            type="number"
          />
        </div>

        <div>
          <label className="label">Service Charge</label>
          <input
            {...register("serviceCharge", { required: true })}
            className="input input-bordered w-full"
            type="number"
          />
        </div>

        <div>
          <label className="label">Application Deadline</label>
          <input
            {...register("deadline", { required: true })}
            type="date"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Post Date</label>
          <input
            {...register("postDate", { required: true })}
            type="date"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Posted User Email</label>
          <input
            {...register("postedEmail", { required: true })}
            type="email"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Initial Average Rating</label>
          <input
            type="number"
            step="0.1"
            {...register("rating", {
              required: "Rating is required",
              min: {
                value: 0,
                message: "Rating must be between 0 and 5",
              },
              max: {
                value: 5,
                message: "Rating must be between 0 and 5",
              },
            })}
            className="input input-bordered w-full"
          />
          {errors.rating && (
            <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label">Scholarship Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="4"
            placeholder="Enter scholarship description..."
            className="textarea textarea-bordered w-full"
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="label">Upload University Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
          {imageUrl && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Uploaded Successfully!
            </p>
          )}
        </div>

        {/* Hidden input to store image URL in form */}
        <input
          type="hidden"
          {...register("universityImage", { required: true })}
        />

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button type="submit" className="btn bg-red-600 text-white font-semibold w-full">
            Submit Scholarship
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;
