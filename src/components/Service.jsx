import LightColoredButton from "./Buttons/LightColoredButton";

function Service({ url, h1, h3, p, btn }) {
  return (
    <div className="flex flex-col gap-6 p-10 bg-sky-50 rounded-xl shadow-lg shadow-customBlue">
      <img
        className="md:max-w-64  md:max-h-64 sm-sm:max-w-40 sm-sm:max-h-40  self-center"
        src={`${url}`}
        alt={`${h1}`}
      />
      <h1 className=" md:text-lg sm-sm:text-base font-medium ">{h1}</h1>
      <h3 className=" border-b-2 border-gray-400 inline-block pb-2  2xl:text-lg xl:text-base sm-sm:max-md:text-sm font-medium">
        {h3}
      </h3>
      <p className="md:text-sm   sm-sm:text-[12px] font-normal leading-normal">
        {p}
      </p>
      <div className="2xl:w-[60%] xl:w-[70%] sm-sm:w-[90%]">
        <LightColoredButton
          style={
            "sm-sm:text-[12px] md:px-2 md:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2 "
          }
          text={btn}
        />
      </div>
    </div>
  );
}

export default Service;
