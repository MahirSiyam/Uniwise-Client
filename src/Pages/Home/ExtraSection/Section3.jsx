import React from "react";

const Section3 = () => {
  return (
    <div className="mt-16 mb-5 px-4 lg:px-0">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="p-4 border border-base-300 rounded shadow-lg bg-base-300">
          <h4 className="font-semibold text-lg mb-2">
            💡 How do I apply for a scholarship?
          </h4>
          <p className="font-extralight">
            Go to any scholarship details page, fill out the form, and complete
            the payment process to apply.
          </p>
        </div>
        <div className="p-4 border border-base-200 rounded shadow-lg bg-base-300">
          <h4 className="font-semibold text-lg mb-2">
            🎓 Can I apply to multiple scholarships?
          </h4>
          <p className="font-extralight">
            Yes! You can apply to as many scholarships as you want, based on
            your eligibility.
          </p>
        </div>
        <div className="p-4 border border-base-200 rounded shadow-lg bg-base-300">
          <h4 className="font-semibold text-lg mb-2">
            🔐 Is my information secure?
          </h4>
          <p className="font-extralight">
            Absolutely. We use secure authentication and encrypted data storage
            to protect your information.
          </p>
        </div>
        <div className="p-4 border border-base-200 rounded shadow-lg bg-base-300">
          <h4 className="font-semibold text-lg mb-2">
            💰 What if my payment fails?
          </h4>
          <p className="font-extralight">
            If payment fails, you'll see an error message. You can retry, and if
            the issue continues, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section3;