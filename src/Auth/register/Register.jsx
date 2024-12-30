import { useState } from "react";

import AnimatedSelect from "../../components/AnimatedSelect";

const Register = () => {
  const [step, setStep] = useState(1);
  const backgroundImage = "../../../src/assets/Login.png";

  const Step1Form = () => (
    <div className="w-full transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-2">S'inscrire</h2>
      <p className="text-gray-600 mb-6">
        Bienvenue à EDTECH100, si premier pas vers votre réussite
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom"
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Prénom"
            className="p-3 border rounded-lg"
          />
        </div>
        <input
          type="email"
          placeholder="Votre email"
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Votre mot de passe"
          className="w-full p-3 border rounded-lg"
        />

        <button
          onClick={() => setStep(2)}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continuer
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
          <img src="../../../src/assets/GOOGLE LOGO.png" className="w-5 h-5" />
          <span>Continuer avec Google</span>
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Si vous avez un compte{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );

  const Step2Form = () => (
    <div className="w-full transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-2">S'inscrire</h2>
      <p className="text-gray-600 mb-6">
        Bienvenue à EDTECH100, si premier pas vers votre réussite
      </p>

      <div className="space-y-4">
        <div className="relative">
          <div className="space-y-4">
            <AnimatedSelect
              options={["France", "Canada", "Belgique"]}
              placeholder="Dans quel pays souhaitez-vous poursuivre vos études ?"
            />
            <AnimatedSelect
              options={["Informatique", "Business", "Engineering"]}
              placeholder="Dans quel domaine souhaitez-vous poursuivre vos études et filières ?"
            />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2"></div>
        </div>

        <div className="relative">
          <AnimatedSelect
            options={[
              "Dans quel domaine souhaitez-vous poursuivre vos études et filières",
            ]}
            placeholder={
              "Dans quel domaine souhaitez-vous poursuivre vos études et filières"
            }
          />
        </div>

        <input
          type="tel"
          placeholder="Your phone number"
          className="w-full p-3 border rounded-lg"
        />

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
          Finalisé
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center  min-h-screen">
      <div className="hidden lg:flex md:w-1/2 relative p-20">
        <div className="absolute inset-0  from-black/40 to-transparent"></div>
        <div className="w-full h-full p-16">
          <img
            src={backgroundImage}
            alt="Airplane in sky"
            className="3xl:w-full 3xl:h-full md:max-2xl:w-[400px] xl:max-2xl:h-full  object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full">
          <div className="transition-all duration-300 ease-in-out">
            {step === 1 ? <Step1Form /> : <Step2Form />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
