import React from "react";
import { ArrowRight, MapPin, DollarSign, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ProgramCard({ title, price, description, imageUrl }) {
  const { t } = useTranslation();
  return (
    <article className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Program Image */}
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full lg:w-72 h-48 lg:h-44 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Price badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                  {title}
                </h2>

                {/* Location indicator */}
                <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <MapPin size={14} />
                  <span>France</span>
                </div>
              </div>

              {/* Price Display (Mobile) */}
              <div className="lg:hidden mb-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                  <DollarSign size={20} />
                  <span>{price}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    {t("Starting from")}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    {t("Description")}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4 border-t border-gray-100">
              {/* Desktop Price Display */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {t("Starting from")}
                </span>
                <div className="flex items-center gap-1 text-xl font-bold text-green-600">
                  <DollarSign size={20} />
                  <span>{price}</span>
                </div>
              </div>

              {/* Apply Button */}
              <Link
                to="/searchProgram/1"
                className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span>{t("Apply")}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  );
}
