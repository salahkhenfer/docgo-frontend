import { useTranslation } from "react-i18next";
import DarkColorButton from "../../components/Buttons/DarkColorButton";
import Container from "../../components/Container";
import contactus from "../../../src/assets/beautiful girl contact us.png"; // Adjust the path as necessary
function HelpSection() {
  const { t } = useTranslation();
  return (
    <Container style="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
      <div className=" rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col items-center sm:flex-row bg-[#F4F4F5] backdrop-blur-[400px]">
          <img
            src={contactus}
            alt="contact us"
            className="lg:max-w-[500px] lg:max-h-[500px] sm:max-w-[400px] sm-sm:max-h-[350px] w-[500px]  object-cover"
          />

          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 bg-[#F4F4F5] backdrop-blur-[400px] ">
            <form className="flex flex-col gap-6 ">
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-customGray font-medium">
                  {t("anyQuestions")}
                </p>
                <h1 className="text-xl md:text-xl lg:text-2xl text-customGray font-medium">
                  {t("loveToHelp")}
                </h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                  placeholder={t("Forename")}
                  type="text"
                />
                <input
                  className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                  placeholder={t("Surname")}
                  type="text"
                />
              </div>
              <input
                className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                placeholder={t("Email")}
                type="email"
              />
              <textarea
                className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
                placeholder={t("YourMessage")}
              />
              <DarkColorButton
                style="sm-sm:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2"
                text={t("Send")}
              />{" "}
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default HelpSection;
