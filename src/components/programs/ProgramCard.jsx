import { t } from "i18next";

export function ProgramCard({ title, price, description, imageUrl }) {
  return (
    <div className="border rounded-lg p-6 flex gap-6">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="French Flag"
        className="w-64 h-44 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-xl font-medium mb-4">{price}</p>
        <div className="mb-4">
          <span className="font-medium"> {t("Description")} </span>
          <span className="text-gray-600">{description}</span>
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {t("Apply")}
        </button>
      </div>
    </div>
  );
}
