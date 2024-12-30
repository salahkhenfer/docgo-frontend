import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CardCourse from "../../components/CardCourse";
import { motion } from "framer-motion";

function CoursesSection() {
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const carousel = useRef();
  const cardsContainer = useRef();

  const checkBoundaries = () => {
    if (!carousel.current || !cardsContainer.current) return;

    const containerWidth = carousel.current.offsetWidth;
    const contentWidth = cardsContainer.current.scrollWidth;
    const maxScroll = contentWidth - containerWidth;

    setShowLeftChevron(Math.abs(position) > 1);
    setShowRightChevron(Math.abs(position) < maxScroll - 1);

    setWidth(maxScroll);
  };

  useLayoutEffect(() => {
    checkBoundaries();
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      setPosition(0);
      checkBoundaries();
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSlideAmount = () => {
    if (!carousel.current) return 0;

    const cards = carousel.current.getElementsByClassName("card-wrapper");
    if (cards.length === 0) return 0;

    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const cardMargin = parseInt(cardStyle.marginRight) || 0;

    return cardWidth + cardMargin;
  };

  const handleLeftClick = () => {
    const slideAmount = getSlideAmount();
    const newPosition = Math.min(position + slideAmount, 0);
    setPosition(newPosition);
  };

  const handleRightClick = () => {
    const slideAmount = getSlideAmount();
    let newPosition = position - slideAmount;

    if (Math.abs(newPosition) > width) {
      newPosition = -width;
    }

    setPosition(newPosition);
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = info.offset.x;
    const newPosition = Math.min(0, Math.max(position + dragDistance, -width));

    setPosition(newPosition);
    checkBoundaries();
  };

  const cards = [
    {
      url: "../../src/assets/image.png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
    {
      url: "../../src/assets/image (1).png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
    {
      url: "../../src/assets/image (2).png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
    {
      url: "../../src/assets/image (2).png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
    {
      url: "../../src/assets/image (2).png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
    {
      url: "../../src/assets/image (2).png",
      title: "Cours de conception UI UX",
      description:
        "La spécialisation en conception UI/UX adopte une approche centrée sur la conception de l'interface utilisateur et de l'expérience utilisateur, et propose une formation pratique et axée sur les compétences ...",
      price: "1356",
      hours: 10,
      lessonNumber: 5,
      starsNumber: 5,
    },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-8 lg:gap-16 xl:gap-24 2xl:gap-32 mt-20 py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-28 xl:px-36 2xl:px-48">
      {showLeftChevron && (
        <button
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 cursor-pointer flex-shrink-0"
          onClick={handleLeftClick}
        >
          <img
            className="w-full h-full"
            src="../../src/assets/chevonLeft.svg"
            alt="chevonLeft icon"
          />
        </button>
      )}
      <motion.div
        ref={carousel}
        className="flex flex-col gap-8 sm:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32 p-4 sm:p-8 lg:p-16 overflow-hidden"
      >
        <h1 className="text-center text-xl sm:text-2xl lg:text-5xl xl:text-6xl font-medium text-customGray">
          Approfondissez vos connaissances avec nos cours
        </h1>
        <motion.div
          ref={cardsContainer}
          drag={isSmallScreen ? "x" : false}
          dragConstraints={{ left: -width, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: position }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 sm:gap-8 lg:gap-16 xl:gap-24 2xl:gap-32 items-center"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="card-wrapper flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] xl:w-[440px] 2xl:w-[500px]"
            >
              <CardCourse
                url={card.url}
                title={card.title}
                ProfesseorName={"Amine"}
                description={card.description}
                price={card.price}
                hours={card.hours}
                lessonNumber={card.lessonNumber}
                starsNumber={card.starsNumber}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
      {showRightChevron && (
        <button
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 cursor-pointer flex-shrink-0"
          onClick={handleRightClick}
        >
          <img
            className="w-full h-full"
            src="../../../src/assets/chevoneRight.svg"
            alt="chevoneRight icon"
          />
        </button>
      )}
    </div>
  );
}

export default CoursesSection;
