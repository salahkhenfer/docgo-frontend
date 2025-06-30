"use client";
import { t } from "i18next";
import { CourseCard } from "./CourseCard";
import { use } from "react";
import { useTranslation } from "react-i18next";

export function CourseGrid() {
  const courses = [
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/5c35b45c65484e09f32277e103bffb3abe2012a7?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0a76e5f4a24915d130143a05d1466aa421f69f1b?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/076bd5738903e0c01b13edf1f9be7615709057e2?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/65452e2a76ef2ff3b4e243d3356df59b4233fb58?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2cf4ecb1e1c3e0e8a8b3f6b12a41e96f8d158be8?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/982bc5b9f712da7dea955fbfc11287dd7d2a2496?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bd1766443532e77ebafa599fd1db2a03858476ea?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3379f3ff85c2033fcab7b0ef01d6b68fd8b52b03?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/cfcc256e1799a85d8b30648e97f98cb5fe99546b?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a2936b5cdb751caae0b570822303fd8e99deeeef?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/46c1e92f41115a52bc4040537a2674929289eca8?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c97a018f099908bd5b8845b1037e81f207899fe2?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
    {
      imageUrl: "",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: false,
    },
    {
      imageUrl: "",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: false,
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/abde435253d0e18bbdddc9165bcae22a7d96e461?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
      title: "Cours de design UI UX",
      description:
        "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
      hasImage: true,
    },
  ];
  const { t } = useTranslation();

  return (
    <section className="self-end mt-12 w-full max-w-[1368px] max-md:mt-10 max-md:max-w-full">
      <h2 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
        {t("TousLesCours")}
      </h2>
      <div className="flex flex-wrap gap-8 items-center mt-12 max-w-full w-[1280px] max-md:mt-10">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            imageUrl={course.imageUrl}
            title={course.title}
            description={course.description}
            hasImage={course.hasImage}
          />
        ))}
      </div>
    </section>
  );
}
