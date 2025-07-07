import React from "react";
import { useTranslation } from "react-i18next";
import SliderButtonProfile from "./SliderButtonProfile";
import { Link } from "react-router-dom";

const CoursesProfileSection = ({ courses, currentSlide, setSlide }) => {
  const { t } = useTranslation();
  const itemsPerSlide = 3;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {t("courses.title")}
        </h2>
        <div className="flex items-center gap-4">
          <SliderButtonProfile
            direction="prev"
            onClick={() =>
              setSlide(
                currentSlide > 0
                  ? currentSlide - 1
                  : Math.ceil(courses.length / itemsPerSlide) - 1
              )
            }
          />
          <SliderButtonProfile
            direction="next"
            onClick={() =>
              setSlide(
                currentSlide < Math.ceil(courses.length / itemsPerSlide) - 1
                  ? currentSlide + 1
                  : 0
              )
            }
          />
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({
            length: Math.ceil(courses.length / itemsPerSlide),
          }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses
                  .slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  )
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="mt-8 text-right">
        <button className="text-blue-500 hover:text-blue-600 font-semibold underline">
          {t("courses.view_all")}
        </button>
      </div> */}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {course.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {course.description}
      </p>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t("courses.progress")}</span>
          <span className="font-medium">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{course.duration}</span>
          <Link
            to={`/CourseDetails/${course.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors"
          >
            {t("courses.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesProfileSection;
