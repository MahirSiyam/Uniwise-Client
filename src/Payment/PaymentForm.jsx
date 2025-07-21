import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { use, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";

const imgbbApiKey = import.meta.env.VITE_image_upload_key;

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = use(AuthContext);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    gender: "",
    degree: "",
    ssc: "",
    hsc: "",
    gap: "",
    photo: null, // FILE
  });
  const [error, setError] = useState("");

  const { data: scholarship, isLoading } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/scholarships/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const applicationFees = parseFloat(scholarship?.applicationFees || 0);
  const serviceCharge = parseFloat(scholarship?.serviceCharge || 0);
  const totalAmount = applicationFees + serviceCharge;

  const mutation = useMutation({
    mutationFn: async (applicationData) => {
      const res = await axiosSecure.post("/applied", applicationData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        Swal.fire("Success", "Your application has been submitted!", "success");
        setFormData({
          phone: "",
          address: "",
          gender: "",
          degree: "",
          ssc: "",
          hsc: "",
          gap: "",
          photo: null,
        });
        const card = elements.getElement(CardElement);
        if (card) card.clear();
      }
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({ type: "card", card });

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    // Upload to imgbb
    const imageForm = new FormData();
    imageForm.append("image", formData.photo);

    const imgRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imageForm,
      }
    );
    const imgData = await imgRes.json();
    const photoUrl = imgData?.data?.url;

    if (!photoUrl) {
      return setError("Photo upload failed");
    }

    // Create payment intent
    const amountInCents = totalAmount * 100;
    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      paymentMethodId: paymentMethod.id,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setError("");

        const applicationData = {
          ...formData,
          photo: photoUrl,
          userName: user.displayName,
          userEmail: user.email,
          scholarshipId: scholarship._id,
          deadline: scholarship.deadline,
          universityName: scholarship.universityName,
          scholarshipCategory: scholarship.scholarshipCategory,
          subjectCategory: scholarship.subjectCategory,
          appliedAt: new Date().toISOString(),
          transactionId: result.paymentIntent.id,
          amountPaid: totalAmount,
          applicationFees,
          serviceCharge,
          status: "pending",
        };

        mutation.mutate(applicationData);
      }
    }
  };

  if (isLoading) return <p>Loading scholarship data...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mt-21 mb-5 mx-auto bg-base-300 p-6 shadow rounded"
    >
      <input
        name="phone"
        onChange={handleChange}
        value={formData.phone}
        placeholder="Phone"
        className="input input-bordered w-full"
        required
      />
      <input
        type="file"
        name="photo"
        onChange={handleChange}
        className="file-input file-input-bordered w-full"
        accept="image/*"
        required
      />
      <input
        name="address"
        onChange={handleChange}
        value={formData.address}
        placeholder="Address"
        className="input input-bordered w-full"
        required
      />
      <select
        name="gender"
        onChange={handleChange}
        value={formData.gender}
        className="select select-bordered w-full"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <select
        name="degree"
        onChange={handleChange}
        value={formData.degree}
        className="select select-bordered w-full"
        required
      >
        <option value="">Select Degree</option>
        <option value="Diploma">Diploma</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Masters">Masters</option>
        <option value="Masters">PhD</option>
      </select>
      <input
        name="ssc"
        onChange={handleChange}
        value={formData.ssc}
        placeholder="SSC Result"
        className="input input-bordered w-full"
        required
      />
      <input
        name="hsc"
        onChange={handleChange}
        value={formData.hsc}
        placeholder="HSC Result"
        className="input input-bordered w-full"
        required
      />
      <select
        name="gap"
        onChange={handleChange}
        value={formData.gap}
        className="select select-bordered w-full"
      >
        <option value="">Study Gap (Optional)</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <input
        type="text"
        readOnly
        value={scholarship.universityName}
        className="input input-bordered w-full bg-base-200"
      />
      <input
        type="text"
        readOnly
        value={scholarship.scholarshipCategory}
        className="input input-bordered w-full bg-base-200"
      />
      <input
        type="text"
        readOnly
        value={scholarship.subjectCategory}
        className="input input-bordered w-full bg-base-200"
      />

      <CardElement className="p-4 border input-bordered rounded-lg shadow-sm" />

      <button
        className="btn bg-red-600 hover:bg-red-700 font-semibold text-white w-full mt-4"
        type="submit"
        disabled={!stripe}
      >
        Pay ৳ {totalAmount}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default PaymentForm;
