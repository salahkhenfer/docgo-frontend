function LightColoredButton({ text }) {
  return (
    <button
      className={`bg-white text-customBlue border-[3px] border-solid border-customBlue px-8 py-3 rounded-3xl font-medium `}
    >
      {text}
    </button>
  );
}

export default LightColoredButton;
