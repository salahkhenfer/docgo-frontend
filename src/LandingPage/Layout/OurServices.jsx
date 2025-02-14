import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import Service from "../../components/Service";
import { Link } from "react-router-dom";

function OurServices() {
  const { t } = useTranslation();

  return (
    <Container
      id={"ourServices"}
      style={
        "flex flex-col gap-12 items-center lg:px-20 lg:py-12 md:px-8 md:py-6 sm-sm:px-4"
      }
    >
      <h1 className=" text-3xl font-medium text-customGray">
        {t("OurServices")}
      </h1>
      <div className="flex items-center justify-center gap-12 sm-sm:max-md:flex-col sm-sm:max-sm:text-center">
        <Service
          url={"../../../src/assets/Knwoledge 1 (1) 1.png"}
          h1={t("GuidanceForStudyingAbroad")}
          h3={t("StudyingAbroadChangesPerspective")}
          p={t("GuidanceDescription")}
          btn={t("SignUpAndDiscover")}
        />

        <Service
          url={"../../../src/assets/Knowledge 2 1.png"}
          h1={t("OnlineCourses")}
          h3={t("LearnAnything")}
          p={t("OnlineCoursesDescription")}
          btn={t("DiscoverAllCourses")}
        />
      </div>
    </Container>
  );
}

export default OurServices;
