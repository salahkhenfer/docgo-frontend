function Footer() {
  return (
    <footer className="bg-gray-50 px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-28">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Spécialités médicales
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Pharmacien
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Médecine
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Sage-femme
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Infirmière
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-6">
              Autres spécialités
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Campus France
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Écoles privées
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Nos services
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Les étapes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Contactez-nous
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Étudier à l'étranger ?
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Nos cours
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Se connecter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  S'inscrire
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <img
              src="../../../src/assets/Logo.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <p className="text-gray-600">
              Notre plateforme offrant des opportunités pour étudier à
              l'étranger et des cours en ligne innovants.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/Facebook.png"
                  alt="facebook logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/Instagram.png"
                  alt="instagram logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/LinkedIn.png"
                  alt="linkedin logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/YouTube.png"
                  alt="youtube logo"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
