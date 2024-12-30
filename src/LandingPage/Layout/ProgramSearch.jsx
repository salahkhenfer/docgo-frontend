import { useState } from "react";

import FindProgramme from "../../components/FindProgramme";
import Programme from "../../components/Programme";
import ThereIsNothing from "../../components/ThereIsNothing";

const ProgramSearch = () => {
  const [programs] = useState([
    {
      id: 1,
      title: "France programme",
      price: "435 DA",
      description:
        "Vel et sit sequi. Quos dolorem atque. Nisi autem ut eveniet qui molestiae nulla repellat. Repellendus nemo saepe. Laboriosam consequatur voluptas amet quibusdam. Et quaerat aspernatur.",
      flag: "../../../src/assets/france flag.png",
    },
    {
      id: 2,
      title: "France programme",
      price: "435 DA",
      description:
        "Vel et sit sequi. Quos dolorem atque. Nisi autem ut eveniet qui molestiae nulla repellat. Repellendus nemo saepe. Laboriosam consequatur voluptas amet quibusdam. Et quaerat aspernatur.",
      flag: "../../../src/assets/france flag.png",
    },
    {
      id: 3,
      title: "France programme",
      price: "435 DA",
      description:
        "Vel et sit sequi. Quos dolorem atque. Nisi autem ut eveniet qui molestiae nulla repellat. Repellendus nemo saepe. Laboriosam consequatur voluptas amet quibusdam. Et quaerat aspernatur.",
      flag: "../../../src/assets/france flag.png",
    },
  ]);

  return (
    <div className="">
      <div className="bg-sky-50 w-full">
        <FindProgramme />
      </div>

      {/* <div className="space-y-6 max-w-4xl mx-auto p-4">
        {programs.map((program, index) => (
          <Programme program={program} key={index} />
        ))}
      </div> */}
      <ThereIsNothing />
    </div>
  );
};

export default ProgramSearch;
