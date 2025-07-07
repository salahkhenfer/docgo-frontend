import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileInfoSection from "../components/userProfile/ProfileInfoSection";
import CoursesProfileSection from "../components/userProfile/CoursesProfileSection";
import ApplicationsProfileSection from "../components/userProfile/ApplicationsProfileSection";
import CertificatesProfileSection from "../components/userProfile/CertificatesProfileSection";

const UserProfile = () => {
  const [courseSlide, setCourseSlide] = useState(0);
  const [applicationSlide, setApplicationSlide] = useState(0);
  const [certificateSlide, setCertificateSlide] = useState(0);

  const userData = {
    profile: {
      name: "Huda Dadoune",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/5b2d0004ed9b5da25976b7f2d4a16021c173fb4f",
      status: "Membre professionnel",
      stats: {
        completed: 15,
        inProgress: 2,
        learningTime: "16 heures par semaine",
      },
    },
    payments: [
      {
        id: 1,
        amount: "2000$",
        purpose: "étudier en France 🇫🇷",
        date: "2024-01-15",
      },
      {
        id: 2,
        amount: "400$",
        purpose: "les cours 🎓",
        date: "2024-01-10",
      },
    ],
    courses: [
      {
        id: 1,
        title: "Cours de design UI UX",
        description:
          "La spécialisation en design UI/UX adopte une approche centrée sur l'interface utilisateur et l'expérience utilisateur...",
        progress: 75,
        duration: "12 semaines",
      },
      {
        id: 2,
        title: "Développement Web Frontend",
        description:
          "Apprenez les technologies modernes du développement frontend avec React, Vue.js et les dernières pratiques...",
        progress: 45,
        duration: "10 semaines",
      },
      {
        id: 3,
        title: "Marketing Digital",
        description:
          "Maîtrisez les stratégies de marketing digital, SEO, publicité en ligne et analyse des données...",
        progress: 90,
        duration: "8 semaines",
      },
      {
        id: 4,
        title: "Gestion de Projet Agile",
        description:
          "Découvrez les méthodologies agiles, Scrum, et les outils de gestion de projet moderne...",
        progress: 30,
        duration: "6 semaines",
      },
      {
        id: 5,
        title: "Data Science et Analytics",
        description:
          "Introduction à l'analyse de données, Python, et les outils de visualisation...",
        progress: 60,
        duration: "14 semaines",
      },
    ],
    applications: [
      {
        id: 1,
        program: "Master en Informatique",
        university: "Université de Paris",
        country: "France",
        status: "approved",
        submissionDate: "2024-01-20",
        deadline: "2024-03-15",
      },
      {
        id: 2,
        program: "MBA International",
        university: "HEC Montréal",
        country: "Canada",
        status: "pending",
        submissionDate: "2024-02-01",
        deadline: "2024-04-01",
      },
      {
        id: 3,
        program: "Doctorat en IA",
        university: "ETH Zurich",
        country: "Suisse",
        status: "rejected",
        submissionDate: "2024-01-10",
        deadline: "2024-02-28",
      },
      {
        id: 4,
        program: "Master en Design",
        university: "Royal College of Art",
        country: "Royaume-Uni",
        status: "under_review",
        submissionDate: "2024-02-15",
        deadline: "2024-05-01",
      },
    ],
    certificates: [
      {
        id: 1,
        title: "Certificat UI/UX Design",
        issuer: "Adobe",
        imageUrl:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
        officialUrl: "https://adobe.com/certificates/ux-design-cert-123",
        issueDate: "2024-01-15",
      },
      {
        id: 2,
        title: "Certificat React Developer",
        issuer: "Meta",
        imageUrl:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
        officialUrl: "https://meta.com/certificates/react-dev-456",
        issueDate: "2024-02-01",
      },
      {
        id: 3,
        title: "Certificat Digital Marketing",
        issuer: "Google",
        imageUrl:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
        officialUrl: "https://google.com/certificates/digital-marketing-789",
        issueDate: "2024-01-28",
      },
      {
        id: 4,
        title: "Certificat Project Management",
        issuer: "PMI",
        imageUrl:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
        officialUrl: "https://pmi.org/certificates/project-mgmt-101",
        issueDate: "2024-02-10",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <ProfileInfoSection profile={userData.profile} />

        <CoursesProfileSection
          courses={userData.courses}
          currentSlide={courseSlide}
          setSlide={setCourseSlide}
        />

        <ApplicationsProfileSection
          applications={userData.applications}
          currentSlide={applicationSlide}
          setSlide={setApplicationSlide}
        />

        <CertificatesProfileSection
          certificates={userData.certificates}
          currentSlide={certificateSlide}
          setSlide={setCertificateSlide}
        />
      </div>
    </div>
  );
};

export default UserProfile;
