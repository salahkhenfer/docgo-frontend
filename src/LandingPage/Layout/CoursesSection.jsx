import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CardCourse from "../../components/CardCourse";
import Container from "../../components/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CoursesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const carouselRef = useRef(null);

  const cards = Array(6).fill({
    url: "../../../src/assets/image.png",
    title: "UI UX Design Course",
    description:
      "The UI/UX design specialization adopts a design-centered approach...",
    price: "1356",
    hours: 10,
    lessonNumber: 5,
    starsNumber: 5,
  });

  useEffect(() => {
    const updateMaxScroll = () => {
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        );
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);

    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPos = Math.abs(carouselRef.current.scrollLeft);
      setScrollPosition(scrollPos);
    }
  };

  const handleMouseDown = (e) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * (isRTL ? -1 : 1);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll);

    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <div id="Coureses" className="relative px-2 sm:px-4 md:px-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 text-center mb-4">
          {t("DeepenYourKnowledgeWithOurCourses")}
        </h2>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{
            direction: isRTL ? "rtl" : "ltr",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {cards.map((card, index) => (
            <div key={index} className="flex-shrink-0">
              <CardCourse {...card} ProfessorName="Amine" />
            </div>
          ))}
        </div>

        <button
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full ${
            scrollPosition <= 0 ? "hidden" : ""
          }`}
          onClick={() =>
            carouselRef.current.scrollBy({
              left: isRTL ? 300 : -300,
              behavior: "smooth",
            })
          }
          aria-label={t("Previous")}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full ${
            scrollPosition >= maxScroll ? "hidden" : ""
          }`}
          onClick={() =>
            carouselRef.current.scrollBy({
              left: isRTL ? -300 : 300,
              behavior: "smooth",
            })
          }
          aria-label={t("Next")}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </Container>
  );
}

export default CoursesSection;
