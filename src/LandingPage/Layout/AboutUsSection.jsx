import Flag from "../../components/Flag";

import BackgroundImage from "../../../src/assets/About us.png";

function AboutUsSection() {
  const flags = [
    { url: "../../../src/assets/France.png", name: "France" },
    { url: "../../../src/assets/canada.png", name: "Canada" },
    { url: "../../../src/assets/England.png", name: "Angleterre" },
    { url: "../../../src/assets/Germany.png", name: "Allemagne" },
    { url: "../../../src/assets/Belgium.png", name: "Belgique" },
    { url: "../../../src/assets/UnitedStates.png", name: "États-Unis" },
  ];

  return (
    <div
      className="relative w-full min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-[#F7FCFF]/20 rounded-lg shadow-lg p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-customGray text-center">
              À propos de nous
            </h1>

            <p className="text-sm sm:text-base lg:text-lg xl:text-2xl text-customGray leading-relaxed text-center">
              Chez GODOC.DZ, nous donnons aux étudiants algériens les moyens
              d&apos;accéder aux opportunités d&apos;études à l&apos;étranger et
              de croissance professionnelle. Fondée par Amine, nous proposons un
              accompagnement personnalisé, des cours en ligne et une communauté
              bienveillante pour vous aider à atteindre vos objectifs
              académiques et professionnels. Libérez votre potentiel avec nous!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-4 lg:gap-6 py-6 md:py-8">
              {flags.map((flag, index) => (
                <Flag key={index} url={flag.url} name={flag.name} />
              ))}
            </div>

            <div className="border-l-2 border-black pl-4 md:pl-6">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-customGray font-medium">
                « Étudier à l&apos;étranger peut changer votre façon de voir le
                monde » ..
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsSection;
