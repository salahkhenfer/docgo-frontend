"use client";
import React, { useState } from "react";
import Checkbox from "./Checkbox";

function CheckboxQuestion() {
  const [selectedOptions, setSelectedOptions] = useState(["B", "D"]);

  const options = [
    { id: "A", label: "A) Pour deviner ce que veulent les utilisateurs" },
    {
      id: "B",
      label: "B) Pour comprendre les besoins et comportements des utilisateurs",
    },
    { id: "C", label: "C) Pour créer des designs accrocheurs" },
    {
      id: "D",
      label:
        "D) pour créer des designs centrés sur l'utilisateur qui résolvent de vrais problèmes",
    },
  ];

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <div className="mt-6 w-full text-zinc-800 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <h2 className="text-2xl font-semibold leading-9 text-zinc-800 max-md:max-w-full">
          Pourquoi la recherche utilisateur est-elle importante dans le
          processus de design ?
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-800 max-md:max-w-full">
          Vous pouvez sélectionner plus de deux options
        </p>
      </div>
      <div className="mt-6 max-w-full text-xl leading-10 w-[874px]">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex flex-wrap gap-6 items-center w-full max-md:max-w-full mt-4 first:mt-0"
          >
            <Checkbox
              isChecked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionChange(option.id)}
            />
            <div className="self-stretch my-auto text-zinc-800 max-md:max-w-full">
              {option.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckboxQuestion;
