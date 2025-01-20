function Step({ Number, label, description }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <span className="rounded-full flex items-center justify-center  border-solid border-[1px] border-gray-50 font-semibold   bg-sky-100 text-customGray sm-sm:w-10 sm-sm:h-10 sm-sm:text-sm lg-sm:w-12 lg-sm:h-12 lg-sm:text-lg 2xl:text-xl 2xl:w-20 2xl:h-20">
        <span> {Number} </span>
      </span>
      <p className="font-medium sm-sm:text-base lg-sm:text-lg 2xl:text-xl">
        {label}
      </p>
      <p className="leading-normal sm-sm:text-[12px] lg-sm:text-sm 2xl:text-base p-2">
        {description}
      </p>
    </div>
  );
}

export default Step;
