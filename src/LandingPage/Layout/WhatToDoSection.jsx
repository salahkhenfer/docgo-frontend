import Step from "../../components/Step";

function WhatToDoSection() {
  return (
    <div className="w-full bg-sky-50 py-8">
      <div className="flex flex-col gap-8 2xl:gap-20 px-28  lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6  sm-sm:max-lg-sm:px-4">
        <h1 className="sm-sm:text-2xl sm-sm:font-medium sm-sm:leading-normal 2xl:text-3xl">
          Que faites-vous pour étudier à l&apos;étranger ?{" "}
        </h1>
        <div className="grid place-items-center sm-sm:grid-cols-1 gap-12 md:grid-cols-2 lg-md:grid-cols-4  ">
          <Step />
          <Step />
          <Step />
          <Step />
        </div>
      </div>
    </div>
  );
}

export default WhatToDoSection;
