import React from "react";
import Banner from "./Banner/Banner";
import Section1 from "./ExtraSection/Section1";
import Section2 from "./ExtraSection/Section2";
import Section3 from "./ExtraSection/Section3";
import TopScholarship from "./ExtraSection/TopScholarship";
import MarqueeBanner from "./MarqueeBanner/MarqueeBanner";
import HomeStats from "./HomeStats/HomeStats";

const Home = () => {
  return (
    <div>
      <div className="max-w-10/12 mx-auto ">
        <Banner></Banner>
        <HomeStats></HomeStats>
        <MarqueeBanner></MarqueeBanner>
        <TopScholarship></TopScholarship>
        <Section1></Section1>
        <Section2></Section2>
        <Section3></Section3>
      </div>
    </div>
  );
};

export default Home;
