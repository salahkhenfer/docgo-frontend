const Login = () => {
  const backgroundImage = "../../../src/assets/Login.png";

  return (
    <div className="flex items-center   min-h-screen">
      <div className="hidden lg:flex md:w-1/2 relative">
        <div className="absolute inset-0  from-black/40 to-transparent"></div>
        <div className="w-[80%] h-full p-16">
          <img
            src={backgroundImage}
            alt="Airplane in sky"
            className="3xl:w-full 3xl:h-full md:max-2xl:w-[400px] xl:max-2xl:h-full  object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">Se connecter</h2>
          <p className="text-gray-600 mb-6">
            Bienvenue à EDTECH100. Si possible signer sur votre compte
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Votre email"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Votre mot de passe"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
              Se connecter
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OU</span>
              </div>
            </div>

            <button className="mt-4 w-full border p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <img
                src="../../../src/assets/GOOGLE LOGO.png"
                className="w-5 h-5"
              />
              <span>Continuer avec Google</span>
            </button>

            <p className="mt-4 text-sm text-gray-600">
              Vous n'avez pas de compte?
              <button className="text-blue-500 hover:underline ml-1">
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
