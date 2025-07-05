import { useState } from "react";
import Select from "react-select";
import { ProgramCard } from "../components/programs/ProgramCard";
import { useTranslation } from "react-i18next";

export function SearchProgram() {
  const { t } = useTranslation();
  const [study, setStudy] = useState(null);
  const [location, setLocation] = useState(null);

  const studyOptions = [
    { value: "all", label: t("TousLesProgrammes") },
    { value: "medicine", label: "Médecine" },
    { value: "dentistry", label: "Dentisterie" },
    { value: "pharmacy", label: "Pharmacie" },
  ];

  const locationOptions = [
    { value: "all", label: t("TousLesPays") },
    { value: "france", label: "France" },
    { value: "belgium", label: "Belgique" },
    { value: "switzerland", label: "Suisse" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: "42px",
      background: "white",
      borderColor: "#E2E8F0",
      "&:hover": {
        borderColor: "#CBD5E1",
      },
    }),
  };

  const programs = [
    {
      title: "Médecine en France",
      price: "435 DA",
      description: "Programme de médecine en France.",
      imageUrl:
        "https://i.pinimg.com/736x/41/d9/76/41d976452bb16956d0f65c60e406c9c5.jpg",
      study: "medicine",
      location: "france",
    },
    {
      title: "Dentisterie en Belgique",
      price: "500 DA",
      description: "Programme de dentisterie en Belgique.",
      imageUrl:
        "https://i.pinimg.com/736x/41/d9/76/41d976452bb16956d0f65c60e406c9c5.jpg",
      study: "dentistry",
      location: "belgium",
    },
    {
      title: "Pharmacie en Suisse",
      price: "600 DA",
      description: "Programme de pharmacie en Suisse.",
      imageUrl:
        "https://i.pinimg.com/736x/41/d9/76/41d976452bb16956d0f65c60e406c9c5.jpg",
      study: "pharmacy",
      location: "switzerland",
    },
  ];

  const filteredPrograms = programs.filter((program) => {
    const selectedStudy = study?.value || "all";
    const selectedLocation = location?.value || "all";

    return (
      (selectedStudy === "all" || program.study === selectedStudy) &&
      (selectedLocation === "all" || program.location === selectedLocation)
    );
  });

  return (
    <div className="bg-[#F0F9FF] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">
          {t("TrouverUnProgramme")}
        </h1>
        <p className="text-gray-600 mb-6">{t("TrouverUnProgrammeDes")}</p>
        <div className="flex gap-4">
          <Select
            styles={customStyles}
            className="w-[300px]"
            placeholder={t("QuelProgrammeVoulezVousEtudier")}
            options={studyOptions}
            value={study}
            onChange={setStudy}
          />
          <Select
            styles={customStyles}
            className="w-[300px]"
            placeholder={t("OuVoulezVousEtudier")}
            options={locationOptions}
            value={location}
            onChange={setLocation}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="space-y-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program, index) => (
              <ProgramCard key={index} {...program} />
            ))
          ) : (
            <div className="flex justify-center items-center text-center">
              <p className="text-gray-500 text-2xl">{t("NoProgramFound")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SearchProgram;
