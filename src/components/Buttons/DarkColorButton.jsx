function DarkColorButton({ text }) {
  return (
    <button
      className={`bg-customBlue text-white border-[3px] border-solid border-customBlue px-8 py-3 rounded-3xl font-medium `}
    >
      {text}
    </button>
  );
}

export default DarkColorButton;
