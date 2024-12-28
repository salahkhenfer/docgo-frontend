import Service from "../../components/Service";

function OurServices() {
  return (
    <div className="py-16 px-28 mt-80 flex flex-col  gap-12 items-center lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm-sm:max-lg-sm:px-4">
      <h1 className="2xl:text-3xl sm:max-xl:text-2xl sm-sm:text-xl   font-medium text-customGray">
        Nos services
      </h1>
      <div className="flex gap-12 sm-sm:max-md:flex-col sm-sm:max-sm:text-center">
        <Service
          url={"../../../src/assets/Knwoledge 1 (1) 1.png"}
          h1={"Guidance pour étudier à l'étranger"}
          h3={"Étudier à l'étranger peut changer votre façon de voir le monde"}
          p={
            "Naviguez votre parcours pour étudier dans les meilleures institutions internationales avec un soutien personnalisé. Notre équipe vous aide à choisir les bons programmes, à préparer votre candidature et à comprendre les exigences"
          }
          btn={"Inscrivez-vous et découvrez"}
        />
        <Service
          url={"../../../src/assets/Knowledge 2 1.png"}
          h1={"Cours en ligne"}
          h3={"Vous pouvez apprendre n'importe quoi"}
          p={
            "Améliorez vos compétences avec nos cours en ligne soigneusement sélectionnés. Apprenez à votre rythme à travers des vidéos, des quiz et des ressources téléchargeables pour renforcer vos connaissances et votre carrière."
          }
          btn={"Découvrez tous nos cours"}
        />
      </div>
    </div>
  );
}

export default OurServices;
