import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import pic1 from "../../../assets/pic1 (1).jpg";
import pic2 from "../../../assets/pic2 (1).jpg";
import pic3 from "../../../assets/pic3 (1).jpg";
import pic4 from "../../../assets/pic4 (1).jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
  // console.log(datas);

  return (
      <Carousel
        className="mb-5 flex-1 shadow-2xs mt-21"
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        transitionTime={2000}
      >
        <div>
          <img className="hero h-[70vh] object-cover" src={pic1} />
        </div>
        <div>
          <img className="hero h-[70vh] object-cover" src={pic2} />
        </div>
        <div>
          <img className="hero h-[70vh] object-cover" src={pic3} />
        </div>
        <div>
          <img className="hero h-[70vh] object-cover" src={pic4} />
        </div>
      </Carousel>
  );
};

export default Banner;
