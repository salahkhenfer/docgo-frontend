import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AnimatedSelect = ({ options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="relative w-full">
      <motion.button
        className="w-full p-3 border rounded-lg bg-white text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.995 }}
      >
        <span
          className={`${!selectedOption ? "text-gray-400" : "text-gray-900"}`}
        >
          {selectedOption || placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
          >
            {options.map((option, index) => (
              <motion.button
                key={option}
                className="w-full p-3 text-left hover:bg-blue-50 transition-colors"
                whileHover={{ x: 4 }}
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AnimatedSelect;
