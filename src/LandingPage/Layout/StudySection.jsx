import DarkColorButton from "../../components/Buttons/DarkColorButton";

function StudySection() {
  return (
    <div className="flex items-center justify-around gap-20 bg-customBlueLight mx-auto my-80  rounded-3xl w-[91rem] ">
      <img
        className="scale-125 -translate-y-16 "
        src="../../../src/assets/ girl.png"
        alt="girl image"
      />
      <form className="flex flex-col gap-5">
        <select className="text-lg font-medium bg-white border-[2px] border-solid border-gray-300 px-28 py-4 rounded-lg">
          <option value=""> Que voulez-vous étudier? </option>
          <option value=""> Que voulez-vous étudier? </option>
          <option value=""> Que voulez-vous étudier? </option>
        </select>
        <select className="text-lg font-medium bg-white border-[2px] border-solid border-gray-300 px-28 py-4 rounded-lg">
          <option value=""> Que voulez-vous étudier? </option>
          <option value=""> Que voulez-vous étudier? </option>
          <option value=""> Que voulez-vous étudier? </option>
        </select>
        <div className="place-self-start">
          <DarkColorButton text="S'inscrire" />
        </div>
      </form>
    </div>
  );
}

export default StudySection;
