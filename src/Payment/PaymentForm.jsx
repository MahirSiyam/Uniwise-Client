import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, use } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../Provider/AuthProvider";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = use(AuthContext);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    phone: "",
    photo: "",
    address: "",
    gender: "",
    degree: "",
    ssc: "",
    hsc: "",
    gap: "",
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

  // Mutation for saving application data
  const mutation = useMutation({
    mutationFn: async (applicationData) => {
      const res = await axiosSecure.post("/applied", applicationData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        Swal.fire("Success", "Your application has been submitted!", "success");
        // Reset form inputs
        setFormData({
          phone: "",
          photo: "",
          address: "",
          gender: "",
          degree: "",
          ssc: "",
          hsc: "",
          gap: "",
        });
        // Clear Stripe card input
        const card = elements.getElement(CardElement);
        if (card) card.clear();
      } else {
        Swal.fire("Failed", "Application submission failed.", "error");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (stripeError) {
      setError(stripeError.message);
      return;
    } else {
      setError("");

      const amountInCents = totalAmount * 100;

      const res = await axiosSecure.post("/create-payment-intent", {
        paymentMethodId: paymentMethod.id,
        amountInCents,
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
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          const applicationData = {
            ...formData,
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
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mt-16 max-w-3xl mx-auto bg-base-100 p-6 shadow-md rounded">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="phone"
          onChange={handleChange}
          value={formData.phone}
          placeholder="Phone"
          className="input input-bordered w-full"
          required
        />
        <input
          name="photo"
          onChange={handleChange}
          value={formData.photo}
          placeholder="Photo URL"
          className="input input-bordered w-full"
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

        <CardElement className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white" />

        <button
          className="btn btn-primary w-full mt-4"
          type="submit"
          disabled={!stripe}
        >
          Pay ৳ {totalAmount}
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
