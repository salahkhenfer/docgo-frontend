import { useState } from "react";

const Switch = () => {
  const [isSwitched, setIsSwitched] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row text-base md:text-xl font-medium p-2 md:p-4 self-center w-full sm:w-auto">
      <button
        onClick={() => setIsSwitched(false)}
        className={`w-full sm:w-auto bg-white border-2 rounded-t-full sm:rounded-s-full sm:rounded-tr-none px-4 md:px-16 py-2 md:py-4 ${
          !isSwitched
            ? "border-customBlue text-customBlue"
            : "border-gray-400 text-customGray"
        }`}
      >
        Étudier à l&apos;étranger
      </button>
      <button
        onClick={() => setIsSwitched(true)}
        className={`w-full sm:w-auto bg-white border-2 rounded-b-full sm:rounded-e-full sm:rounded-bl-none px-4 md:px-16 py-2 md:py-4 ${
          isSwitched
            ? "border-customBlue text-customBlue"
            : "border-gray-400 text-customGray"
        }`}
      >
        Cours d&apos;apprentissage
      </button>
    </div>
  );
};

export default Switch;
