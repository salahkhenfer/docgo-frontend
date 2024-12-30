import { ChevronDown } from "lucide-react";
function FindProgramme() {
  return (
    <div className="max-w-4xl mx-auto  p-8 rounded-lg mb-8">
      <h1 className="text-xl font-semibold mb-2">Trouver un programme</h1>
      <p className="text-sm text-gray-600 mb-4">
        Choisir le pays et la specialité et recherché
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8">
            <option>Que voulez-vous etudier?</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
        </div>

        <div className="relative flex-1">
          <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8">
            <option>Où voulez-vous etudier?</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
        </div>

        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Rechercher
        </button>
      </div>
    </div>
  );
}

export default FindProgramme;
