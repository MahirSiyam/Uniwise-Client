import React from "react";

import oxford from "../../../assets/oxford.jpg";
import harvard from "../../../assets/harward.jpg";
import tokyo from "../../../assets/tokeyo.jpg";

const Section1 = () => {
  return (
    <div className="mt-16 px-4 lg:px-0">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Universities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className=" p-5 rounded-lg shadow-lg text-center bg-base-300">
          <img
            src={oxford}
            alt="Oxford"
            className="w-full h-50 mx-auto mb-4 object-contain"
          />
          <h3 className="text-xl font-semibold">University of Oxford</h3>
          <p className="font-extralight">UK · Ranked #1 Worldwide</p>
        </div>
        <div className=" p-5 rounded-lg shadow-lg text-center bg-base-300">
          <img
            src={harvard}
            alt="Harvard"
            className="w-full h-50 mx-auto mb-4 object-contain"
          />
          <h3 className="text-xl font-semibold">Harvard University</h3>
          <p className="font-extralight">USA · Leader in Research Scholarships</p>
        </div>
        <div className=" p-5 rounded-lg shadow-lg text-center bg-base-300">
          <img
            src={tokyo}
            alt="Tokyo University"
            className="w-full h-50 mx-auto mb-4 object-contain"
          />
          <h3 className="text-xl font-semibold">University of Tokyo</h3>
          <p className="font-extralight">Japan · Engineering & Science Focus</p>
        </div>
      </div>
    </div>
  );
};

export default Section1;
