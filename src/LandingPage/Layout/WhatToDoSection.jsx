import { useTranslation } from "react-i18next";
import Step from "../../components/Step";

function WhatToDoSection() {
  const { t } = useTranslation();

  return (
      <div id="Steps" className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Animated Circles */}
              <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-400/10 rounded-full filter blur-2xl animate-pulse animation-delay-3000"></div>
              
              {/* Floating Dots Pattern */}
              <div className="absolute top-20 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-float"></div>
              <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-indigo-400/30 rounded-full animate-float animation-delay-4000"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-12 md:gap-16 px-6 md:px-12 lg:px-20 xl:px-28 max-w-7xl mx-auto">
              {/* Enhanced Title Section */}
              <div className="text-center space-y-4">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-tight">
                      {t("WhatToDoToStudyAbroad")}
                  </h1>
                  <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
              </div>

              <div className="grid place-items-stretch sm-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
                  <Step
                      Number={1}
                      label={t("Register")}
                      description={t("CreateAccountAndSubmitInfo")}
                  />
                  <Step
                      Number={2}
                      label={t("Connexion")}
                      description={t("OurTeamGuidesVisaProcess")}
                  />
                  <Step
                      Number={3}
                      label={t("Submit")}
                      description={t("CompleteVisaApplication")}
                  />
                  <Step
                      Number={4}
                      // label={t("Flight")}
                      label={t("wewillcontactyou")}
                      // description={t("ReceiveVisaAndPrepare")}
                      description={t("wewillcontactyoudesc")}
                  />
              </div>
          </div>
      </div>
  );
}

export default WhatToDoSection;
