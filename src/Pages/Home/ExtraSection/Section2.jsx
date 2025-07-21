import React from "react";

const Section2 = () => {
  return (
    <div className="mt-16 px-4 lg:px-0">
      <h2 className="text-3xl font-bold text-center mb-10">
        How UniWise Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="border border-base-300 p-6 bg-base-300 rounded-lg shadow-lg">
          <div className="text-5xl mb-4 text-red-600 font-bold">1</div>
          <h3 className="text-xl font-semibold mb-2">Search Scholarships</h3>
          <p className="font-extralight">
            Use filters to find scholarships based on your degree, country or
            field of study.
          </p>
        </div>
        <div className="border border-base-300 p-6 bg-base-300 rounded-lg shadow-lg">
          <div className="text-5xl mb-4 text-red-600 font-bold">2</div>
          <h3 className="text-xl font-semibold mb-2">Apply & Pay</h3>
          <p className="font-extralight">
            Submit your application by filling out the form and paying the
            application fee.
          </p>
        </div>
        <div className="border border-base-300 p-6 bg-base-300 rounded-lg shadow-lg">
          <div className="text-5xl mb-4 text-red-600 font-bold">3</div>
          <h3 className="text-xl font-semibold mb-2">Track & Review</h3>
          <p className="font-extralight">
            Track your application status and leave reviews to help others!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section2;
