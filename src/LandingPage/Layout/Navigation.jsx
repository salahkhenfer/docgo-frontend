import LightColoredButton from "../../components/Buttons/LightColoredButton";

function Navigation() {
  return (
    <nav className="flex justify-between items-center px-28 py-16">
      <img
        className="w-28 h-28  rounded-full"
        src="./src/assets/Logo.png"
        alt="Godoc Agency logo"
      />
      <div className="flex justify-center items-center gap-8 text-xl font-medium">
        <a
          className="no-underline  text-customGray"
          href="#specialitiesMedical"
        >
          Spécialités médicales
        </a>
        <a href="no-underline  text-customGray">Autres spécialités</a>
        <a href="no-underline  text-customGray">Nos services</a>
        <a href="no-underline  text-customGray">À propos de nous</a>
      </div>
      <LightColoredButton text="Être étudiant" />
    </nav>
  );
}

export default Navigation;
