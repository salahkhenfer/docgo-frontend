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
    const walk = x - startX;

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

  const handleScrollButton = (direction) => {
    const scrollAmount = 300;
    if (carouselRef.current) {
      const scrollValue = direction === "right" ? scrollAmount : -scrollAmount;

      const adjustedScrollValue = isRTL ? -scrollValue : scrollValue;
      carouselRef.current.scrollBy({
        left: adjustedScrollValue,
        behavior: "smooth",
      });
    }
  };

  return (
    <Container>
      <div id="Coureses" className="relative px-2 sm:px-4 md:px-6">
        <h2 className="lg:text-2xl sm:text-xl sm-sm:text-lg font-medium  text-gray-700 text-center mb-8">
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
          onClick={() => handleScrollButton("left")}
          aria-label={t("Previous")}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full ${
            scrollPosition >= maxScroll ? "hidden" : ""
          }`}
          onClick={() => handleScrollButton("right")}
          aria-label={t("Next")}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </Container>
  );
}

export default CoursesSection;
