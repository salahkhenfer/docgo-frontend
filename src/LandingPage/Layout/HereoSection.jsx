import DarkColorButton from "../../components/Buttons/DarkColorButton";

function HereoSection() {
  return (
    <div className=" flex justify-between items-center w-full h-full py-16 px-28  lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm-sm:max-lg-sm:flex-col sm-sm:max-lg-sm:px-4">
      <div className="flex flex-col items-start gap-5 w-[50%] py-16 sm-sm:max-lg-sm:items-center sm-sm:max-lg-sm:w-full  ">
        <p className="text-lg text-customGray font-normal md:max-3xl:text-base md:max-lg-md:text-sm sm-sm:max-lg-sm:text-sm sm-sm:max-lg-sm:text-center">
          Explorez le monde des opportunités
        </p>
        <h1 className="text-5xl text-customGray font-medium leading-snug	md:max-3xl:text-2xl lg-md:max-3xl:leading-normal md:max-lg-md:text-xl sm-sm:max-lg-sm:text-center sm-sm:max-lg-sm:text-xl">
          Plongez dans un monde de possibilités : Étudiez à l&apos;étranger avec
          Amine
        </h1>
        <p className="text-lg text-customGray leading-10 font-normal md:max-3xl:text-base lg-md:max-3xl:leading-normal md:max-lg-md:text-sm sm-sm:max-lg-sm:text-center sm-sm:max-lg-sm:text-sm ">
          Rejoignez-nous pour découvrir d&apos;incroyables options d&apos;études
          à l&apos;étranger et élever votre apprentissage à travers des cours
          spécialisés
        </p>
        <DarkColorButton text="Étudier à l'étranger" />
      </div>
      <img
        className="w-[632px] h-[485px] bg-gray-500 rounded-lg md:max-3xl:w-[400px] md:max-3xl:h-[300px]  "
        src=""
        alt=""
      />
    </div>
  );
}

export default HereoSection;
