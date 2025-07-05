import React from "react";
import { useTranslation } from "react-i18next";
import { FaDollarSign, FaClock, FaStar, FaPlay, FaLock } from "react-icons/fa";

export const CourseDetails = () => {
  const { t } = useTranslation();

  const courseData = {
    title: "Fondements du design : Des bases à la maîtrise professionnelle",
    description:
      "Apprenez les principes de design essentiels, explorez la théorie des couleurs, la typographie et le design d'interface utilisateur, et acquérez de l'expérience pratique avec des outils comme Adobe Illustrator et Figma. Ce cours est idéal pour toute personne souhaitant améliorer ses compétences en design ou démarrer une carrière dans le design.",
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5c35b45c65484e09f32277e103bffb3abe2012a7?placeholderIfAbsent=true",
    level: "Cours pour débutants",
    price: "49,99 ",
    duration: "10",
    rating: "4,5",
    videos: [
      {
        id: 1,
        title: "Introduction aux principes du design",
        duration: "15:30",
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 2,
        title: "Théorie des couleurs et palettes",
        duration: "22:45",
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 3,
        title: "Typographie et hiérarchie visuelle",
        duration: "18:20",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 4,
        title: "Composition et mise en page",
        duration: "25:10",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 5,
        title: "Introduction à Adobe Illustrator",
        duration: "32:15",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 6,
        title: "Création de logos et identité visuelle",
        duration: "28:45",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 7,
        title: "Design d'interface utilisateur avec Figma",
        duration: "35:20",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: 8,
        title: "Prototypage et tests utilisateur",
        duration: "20:30",
        isLocked: true,
        isCompleted: false,
      },
    ],
  };

  const handleVideoClick = (video) => {
    if (!video.isLocked) {
      console.log(`Playing video: ${video.title}`);
      // Add your video player logic here
    }
  };

  return (
    <div className="flex flex-col max-w-full w-[797px] mx-auto px-4">
      <header>
        <h1 className="text-4xl font-bold text-zinc-800 max-md:text-3xl">
          {courseData.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          {courseData.description}
        </p>
        <img
          src={courseData.imageUrl}
          alt="Course Illustration"
          className="mt-6 w-full h-auto rounded-2xl shadow-md"
        />
        <div className="flex flex-wrap gap-4 items-center mt-6">
          <span className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-sm font-medium">
            {courseData.level}
          </span>
          <div className="flex items-center gap-2 text-zinc-800 text-sm">
            <span>{courseData.price} DZD</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-800 text-sm">
            <FaClock className="text-blue-500" />
            <span>
              {courseData.duration} {t("heure")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-800 text-sm">
            <FaStar className="text-yellow-400" />
            <span>{courseData.rating}</span>
          </div>
        </div>
        <div className="mt-5">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition">
            {t("Completezvotreeducation")}
          </button>
        </div>
      </header>

      {/* Videos Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-zinc-800 mb-6">
          Contenu du cours
        </h2>
        <div className="space-y-3">
          {courseData.videos.map((video, index) => (
            <div
              key={video.id}
              className={`flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                video.isLocked
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
              onClick={() => handleVideoClick(video)}
            >
              <div className="flex-shrink-0 mr-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    video.isLocked
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {video.isLocked ? (
                    <FaLock className="text-sm" />
                  ) : (
                    <FaPlay className="text-sm ml-1" />
                  )}
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        video.isLocked ? "text-gray-500" : "text-zinc-800"
                      }`}
                    >
                      {index + 1}. {video.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        video.isLocked ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {video.duration}
                    </span>
                    {video.isCompleted && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <FaLock className="inline mr-2" />
            Inscrivez-vous au cours pour débloquer toutes les vidéos et accéder
            au contenu complet.
          </p>
        </div>
      </section>
    </div>
  );
};
