import Marquee from "react-fast-marquee";

const UniversityMarquee = () => {
  const universities = [
    {
      name: "Harvard",
      logo: 'https://cdn-editing-temp.picsart.com/editing-temp-landings/26a46e31-8d0f-4aeb-83ad-039d4504dc82.png',
    },
    {
      name: "MIT",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    },
    {
      name: "Stanford",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/2ed8f363-edaa-4ab5-a44f-d16cb2d76de7.png",
    },
    {
      name: "Oxford",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/7e50d1a5-20ac-4b11-a0b6-e1570aa3e609.png",
    },
    {
      name: "Cambridge",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/536b0de6-eaec-42fe-9a42-a77b5dc81852.png",
    },
    {
      name: "Yale",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/a477607e-2d0c-495e-8f1d-8b1515c558b2.png",
    },
    {
      name: "Caltech",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/9dcb101a-6620-4f23-9482-277f03b99e8f.png",
    },
    {
      name: "ETH Zurich",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/b11df61e-1d06-444b-a033-049c95a4ca76.png",
    },
    {
      name: "University of Tokyo",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/6f25d643-57d1-43a0-bbe5-2fd4e2b8410f.png",
    },
    {
      name: "University of Toronto",
      logo: "https://cdn-editing-temp.picsart.com/editing-temp-landings/298d255c-0529-4dc0-b03d-147faa96c5ac.png",
    },
  ];

  return (
    <div className="bg-base-300 py-5 mt-16">
      <Marquee speed={50} pauseOnHover={true} gradient={false}>
        {universities.map((uni, index) => (
          <div key={index} className="flex items-center gap-2 mx-6">
            <img
              src={uni.logo}
              alt={uni.name}
              className="h-30 w-auto object-contain"
              title={uni.name}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default UniversityMarquee;
