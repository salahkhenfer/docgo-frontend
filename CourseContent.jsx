export const CourseContent = () => {
  const courseContent = {
    videoCount: 4,
    lessons: [
      {
        title: "Introduction au design",
        description:
          "Une introduction aux principes de design fondamentaux que chaque designer doit maîtriser.",
      },
      {
        title: "Théorie des couleurs",
        description:
          "Découvrez comment utiliser la couleur efficacement pour évoquer des émotions et améliorer vos designs.",
      },
      {
        title: "Typographie",
        description:
          "Apprenez à choisir et à associer des polices pour créer des designs lisibles et visuellement frappants.",
      },
      {
        title: "Illustrator pour débutants",
        description:
          "Un tutoriel pratique sur l'utilisation d'Adobe Illustrator pour donner vie à vos idées de design.",
      },
    ],
  };

  return (
    <section className="mt-8 w-full max-w-4xl mx-auto px-6 text-zinc-800">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          {courseContent.videoCount} vidéos
        </h2>
        <div className="space-y-6">
          {courseContent.lessons.map((lesson, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <span className="flex w-8 h-8 bg-blue-500 text-white rounded-full items-center justify-center mr-3">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
              </div>

              <p className="text-base text-zinc-700 leading-relaxed">
                {lesson.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
