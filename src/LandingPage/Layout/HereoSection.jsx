import DarkColorButton from "../../components/Buttons/DarkColorButton";

function HereoSection() {
  return (
    <div className=" flex justify-between items-center w-full h-full py-16 px-28">
      <div className="flex flex-col items-start gap-5 w-[50%] py-16   ">
        <p className="text-lg text-customGray font-normal">
          Explorez le monde des opportunités
        </p>
        <h1 className="text-5xl text-customGray font-medium leading-snug	">
          Plongez dans un monde de possibilités : Étudiez à l&apos;étranger avec
          Amine
        </h1>
        <p className="text-lg text-customGray leading-10 font-normal">
          Rejoignez-nous pour découvrir d&apos;incroyables options d&apos;études
          à l&apos;étranger et élever votre apprentissage à travers des cours
          spécialisés
        </p>
        <DarkColorButton text="Étudier à l'étranger" />
      </div>
      <img
        className="w-[632px] h-[485px] bg-gray-500 rounded-lg "
        src=""
        alt=""
      />
    </div>
  );
}

export default HereoSection;
