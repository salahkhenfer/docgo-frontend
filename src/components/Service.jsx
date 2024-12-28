import LightColoredButton from "./Buttons/LightColoredButton";

function Service({ url, h1, h3, p, btn }) {
  return (
    <div className="flex flex-col gap-6 2xl:p-12 2xl:px-20 xl:p-10 xl:px-16 sm:p-10 sm-sm:p-8 md:p-6 bg-sky-50 rounded-xl shadow-lg shadow-customBlue">
      <img
        className="sm:w-80 h-80 sm-sm:w-60 sm-sm:h-60 self-center"
        src={`${url}`}
        alt={`${h1}`}
      />
      <h1 className="2xl:text-2xl xl:text-xl sm-sm:text-lg font-medium md:text-lg">
        {h1}
      </h1>
      <h3 className=" border-b-2 border-gray-400 inline-block pb-2  2xl:text-xl xl:text-lg sm-sm:max-md:text-base  font-medium">
        {h3}
      </h3>
      <p className="2xl:text-lg xl:text-base md:text-base sm-sm:text-sm  font-normal leading-normal">
        {p}
      </p>
      <div className="2xl:w-[60%] xl:w-[70%] sm-sm:w-[90%]">
        <LightColoredButton
          style={"sm-sm:max-sm:p-2 sm-sm:max-sm:text-sm"}
          text={btn}
        />
      </div>
    </div>
  );
}

export default Service;
