function Step() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="rounded-full flex items-center justify-center  border-solid border-[1px] border-gray-50 font-semibold   bg-sky-100 text-customGray sm-sm:w-10 sm-sm:h-10 sm-sm:text-sm lg-sm:w-12 lg-sm:h-12 lg-sm:text-lg 2xl:text-xl 2xl:w-20 2xl:h-20">
        <span> 1 </span>
      </span>
      <p className="font-medium sm-sm:text-lg lg-sm:text-xl 2xl:text-2xl">
        Inscription
      </p>
      <p className="leading-normal sm-sm:text-sm lg-sm:text-base 2xl:text-lg p-2">
        Créez votre compte et soumettez vos coordonnées pour commencer votre
        demande de visa.
      </p>
    </div>
  );
}

export default Step;
