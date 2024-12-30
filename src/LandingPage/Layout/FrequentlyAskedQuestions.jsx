import AnswerQuestion from "../../components/AnswerQuestion";
import DarkColorButton from "../../components/Buttons/DarkColorButton";
import Switch from "../../components/Switch";
import BackgroundImage from "../../../src/assets/three monochrome plastic spheres.png";
import LightColoredButton from "../../components/Buttons/LightColoredButton";

function FrequentlyAskedQuestions() {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",

        backgroundSize: "contain",
      }}
      className="w-full flex justify-center items-center bg-sky-50 mt-10 md:mt-20 min-h-screen relative"
    >
      <div className="flex flex-col gap-6 bg-sky-50 opacity-95 md:gap-10 p-4 md:p-20 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] max-w-7xl relative z-10">
        <div className="relative w-full aspect-[3/2] md:aspect-[2/1]">
          <img
            className="w-full h-full object-contain"
            src="../../../src/assets/geometric shapes.png"
            alt="geometric shapes"
          />
        </div>

        <h1 className="text-2xl md:text-3xl text-center font-medium text-customGray">
          Questions fréquemment posées
        </h1>

        <p className="text-customGray text-center leading-normal font-normal text-base md:text-lg px-4">
          Ce sont les questions les plus fréquemment posées sur EduVoyage. Vous
          ne trouvez pas ce que vous cherchez ?
        </p>

        <DarkColorButton
          style="flex gap-2 items-center justify-center w-full sm:w-[60%] md:w-[40%] text-center self-center"
          icon={
            <img
              src="../../../src/assets/phone.png"
              alt="phone icon"
              className="w-5 h-5"
            />
          }
          text="Entrer en contact"
        />

        <Switch />

        <div className="flex flex-col gap-4 md:gap-8">
          <AnswerQuestion
            question="Comment commencer le processus pour étudier à l'étranger ?"
            answer="Il vous suffit de vous inscrire sur notre plateforme, de remplir vos coordonnées, et notre équipe vous guidera tout au long du processus de candidature et de visa."
          />
          <AnswerQuestion
            question="Comment commencer le processus pour étudier à l'étranger ?"
            answer="Il vous suffit de vous inscrire sur notre plateforme, de remplir vos coordonnées, et notre équipe vous guidera tout au long du processus de candidature et de visa."
          />
          <AnswerQuestion
            question="Comment commencer le processus pour étudier à l'étranger ?"
            answer="Il vous suffit de vous inscrire sur notre plateforme, de remplir vos coordonnées, et notre équipe vous guidera tout au long du processus de candidature et de visa."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full sm:w-[80%] md:w-[60%] lg:w-[50%] ml-auto">
          <LightColoredButton
            style="w-full sm:w-[50%] flex justify-center items-center gap-2 text-center"
            text="Précédent"
            icon={<img src="../../../src/assets/arrow-left.png" />}
          />
          <DarkColorButton
            style="w-full flex-row-reverse sm:w-[50%] flex justify-center items-center gap-2 text-center"
            text="Suivant"
            icon={<img src="../../../src/assets/arrow-right.png" />}
          />
        </div>
      </div>
    </div>
  );
}

export default FrequentlyAskedQuestions;
