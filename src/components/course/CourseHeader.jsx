import React from "react";
import { useTranslation } from "react-i18next";
import { FaDollarSign, FaClock, FaStar } from "react-icons/fa";

export const CourseHeader = () => {
  const { t } = useTranslation();
  const courseInfo = {
    title: "Fondements du design : Des bases à la maîtrise professionnelle",
    description:
      "Apprenez les principes de design essentiels, explorez la théorie des couleurs, la typographie et le design d'interface utilisateur, et acquérez de l'expérience pratique avec des outils comme Adobe Illustrator et Figma. Ce cours est idéal pour toute personne souhaitant améliorer ses compétences en design ou démarrer une carrière dans le design.",
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5c35b45c65484e09f32277e103bffb3abe2012a7?placeholderIfAbsent=true",
    level: "Cours pour débutants",
    price: "49,99 ",
    duration: "10",
    rating: "4,5",
  };

  return (
    <header className="flex flex-col max-w-full w-[797px] mx-auto px-4">
      <h1 className="text-4xl font-bold text-zinc-800 max-md:text-3xl">
        {courseInfo.title}
      </h1>

      <p className="mt-4 text-base leading-7 text-neutral-600">
        {courseInfo.description}
      </p>

      {/* ⬇️ Image after the description */}
      <img
        src={courseInfo.imageUrl}
        alt="Course Illustration"
        className="mt-6 w-full h-auto rounded-2xl shadow-md"
      />

      <div className="flex flex-wrap gap-4 items-center mt-6">
        <span className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-sm font-medium">
          {courseInfo.level}
        </span>

        <div className="flex items-center gap-2 text-zinc-800 text-sm">
          <span>{courseInfo.price} DZD</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-800 text-sm">
          <FaClock className="text-blue-500" />
          <span>
            {courseInfo.duration} {t("heure")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-800 text-sm">
          <FaStar className="text-yellow-400" />
          <span>{courseInfo.rating}</span>
        </div>
      </div>

      <div className="mt-5">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition">
          {t("Completezvotreeducation")}
        </button>
      </div>
    </header>
  );
};
