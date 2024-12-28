import Flag from "../../components/Flag";

import BackgroundImage from "../../../src/assets/About us.png";

function AboutUsSection() {
  return (
    <div
      className="w-full h-[50rem] sm-sm:max-md:h-[40rem] flex items-center justify-center lg:px-10 md:px-8 sm:p-6 "
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col gap-8   sm-sm:scale-75 justify-center items-center rounded-lg bg-[#F7FCFF] bg-opacity-20 shadow-sm shadow-gray-400  2xl:w-[60%] sm:max-xl:p-16 2xl:p-20 sm-sm:p-2 xl:w-1/2  ">
        <h1 className=" 2xl:text-5xl font-medium text-customGray lg:text-xl md:text-xl sm:text-lg">
          À propos de nous
        </h1>
        <p className="2xl:text-2xl leading-relaxed text-customGray md:text-base sm-sm:max-md:text-sm">
          Chez GODOC.DZ, nous donnons aux étudiants algériens les moyens
          d&apos;accéder aux opportunités d&apos;études à l&apos;étranger et de
          croissance professionnelle. Fondée par Amine, nous proposons un
          accompagnement personnalisé, des cours en ligne et une communauté
          bienveillante pour vous aider à atteindre vos objectifs académiques et
          professionnels. Libérez votre potentiel avec nous!
        </p>
        <div className="flex justify-between  2xl:gap-24 xl:gap-10 lg:gap-6 md:gap-4 sm-sm:max-md:gap-4 flex-wrap">
          <Flag url={"../../../src/assets/France.png"} name={"France"} />
          <Flag url={"../../../src/assets/canada.png"} name={"Canada"} />
          <Flag url={"../../../src/assets/England.png"} name={"Angleterre"} />
          <Flag url={"../../../src/assets/Germany.png"} name={"Allemagne"} />
          <Flag url={"../../../src/assets/Belgium.png"} name={"Belgique"} />
          <Flag
            url={"../../../src/assets/UnitedStates.png"}
            name={"États-Unis"}
          />
        </div>
        <div className="border-solid border-l-2 border-black self-start mt-4">
          <p className="2xl:text-3xl text-customGray font-medium ml-2 lg:text-lg md:text-base sm-sm:max-md:text-base ">
            « Étudier à l&apos;étranger peut changer votre façon de voir le
            monde » ..
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsSection;
