function DarkColorButton({ text, style = "" }) {
  return (
    <button
      className={`bg-customBlue text-white border-[3px] border-solid border-customBlue px-8 py-3 rounded-3xl font-medium  md:max-lg:text-sm  md:max-lg:px-4 md:max-lg:py-2 sm-sm:max-lg-sm:px-2 sm-sm:max-lg-sm:py-1 sm-sm:max-lg-sm:text-sm ${style}`}
    >
      {text}
    </button>
  );
}

export default DarkColorButton;
