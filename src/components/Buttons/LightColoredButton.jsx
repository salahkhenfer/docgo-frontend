function LightColoredButton({ text }) {
  return (
    <button
      className={`bg-white text-customBlue border-[3px] border-solid border-customBlue px-8 py-3 rounded-3xl font-medium md:max-lg:text-sm  md:max-lg:px-4 md:max-lg:py-2 `}
    >
      {text}
    </button>
  );
}

export default LightColoredButton;
