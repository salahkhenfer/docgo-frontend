import FindProgramme from "../../components/FindProgramme";
import Programme from "../../components/Programme";
import ThereIsNothing from "../../components/ThereIsNothing";
import { useTranslation } from "react-i18next";

const ProgramSearch = () => {
  const { t } = useTranslation();
  const programs = [
    {
      id: 1,
      title: t("FranceProgram"),
      price: "435 DA",
      description: t("desc"),
      flag: "../../../src/assets/france flag.png",
    },
    {
      id: 2,
      title: t("FranceProgram"),
      price: "435 DA",
      description: t("desc"),
      flag: "../../../src/assets/france flag.png",
    },
    {
      id: 3,
      title: t("FranceProgram"),
      price: "435 DA",
      description: t("desc"),
      flag: "../../../src/assets/france flag.png",
    },
  ];

  return (
    <div className="">
      <div className="bg-sky-50 w-full">
        <FindProgramme />
      </div>

      {
        <div className="space-y-6 max-w-4xl mx-auto p-4">
          {programs.map((program, index) => (
            <Programme program={program} key={index} />
          ))}
        </div>
      }
      {/*    <ThereIsNothing /> */}
    </div>
  );
};

export default ProgramSearch;
