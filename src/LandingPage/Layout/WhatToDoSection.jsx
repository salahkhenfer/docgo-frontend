import { useTranslation } from "react-i18next";
import Step from "../../components/Step";

function WhatToDoSection() {
  const { t } = useTranslation();

  return (
    <div id="Steps" className="w-full bg-sky-50 py-8">
      <div className="flex flex-col gap-8 2xl:gap-20 px-28 lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm-sm:max-lg-sm:px-4">
        <h1 className="sm-sm:text-xl sm-sm:font-medium sm-sm:leading-normal 2xl:text-2xl">
          {t("WhatToDoToStudyAbroad")}
        </h1>
        <div className="grid place-items-center sm-sm:grid-cols-1 gap-12 md:grid-cols-4 lg-md:grid-cols-4">
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
            label={t("Flight")}
            description={t("ReceiveVisaAndPrepare")}
          />
        </div>
      </div>
    </div>
  );
}

export default WhatToDoSection;
