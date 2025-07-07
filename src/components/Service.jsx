import { Link } from "react-router-dom";
import LightColoredButton from "./Buttons/LightColoredButton";

function Service({ url, h1, h3, p, btn, to }) {
  return (
    <div className="flex flex-col sm-sm:max-sm:items-center gap-6 p-4 lg:w-1/3 sm:w-1/2 sm-sm:w-10/12 bg-sky-50 rounded-xl shadow-lg shadow-customBlue">
      <img
        className="md:max-w-56  md:max-h-56 sm-sm:max-w-40 sm-sm:max-h-40  self-center"
        src={`${url}`}
        alt={`${h1}`}
      />
      <h1 className=" md:text-base sm-sm:text-sm font-medium ">{h1}</h1>
      <h3 className=" border-b-2 border-gray-400 inline-block pb-2 xl:text-base sm-sm:max-md:text-sm font-medium">
        {h3}
      </h3>
      <p className="md:text-sm   sm-sm:text-[12px] font-normal leading-normal">
        {p}
      </p>
      <div className="2xl:w-[60%] xl:w-[70%] sm-sm:w-[90%]">
        <Link to={to}>
          <LightColoredButton
            style={
              "sm-sm:text-[12px] md:px-2 md:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2 "
            }
            text={btn}
          />
        </Link>
      </div>
    </div>
  );
}

export default Service;
