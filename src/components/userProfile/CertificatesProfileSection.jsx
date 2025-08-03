import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import SliderButtonProfileProfile from "./SliderButtonProfile";

const CertificatesProfileSection = ({
    certificates,
    currentSlide,
    setSlide,
}) => {
    const { t } = useTranslation();
    const itemsPerSlide = 3;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("certificates.title")}
                </h2>
                <div className="flex items-center gap-4">
                    <SliderButtonProfileProfile
                        direction="prev"
                        onClick={() =>
                            setSlide(
                                currentSlide > 0
                                    ? currentSlide - 1
                                    : Math.ceil(
                                          certificates.length / itemsPerSlide
                                      ) - 1
                            )
                        }
                    />
                    <SliderButtonProfileProfile
                        direction="next"
                        onClick={() =>
                            setSlide(
                                currentSlide <
                                    Math.ceil(
                                        certificates.length / itemsPerSlide
                                    ) -
                                        1
                                    ? currentSlide + 1
                                    : 0
                            )
                        }
                    />
                </div>
            </div>
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {Array.from({
                        length: Math.ceil(certificates.length / itemsPerSlide),
                    }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificates
                                    .slice(
                                        slideIndex * itemsPerSlide,
                                        (slideIndex + 1) * itemsPerSlide
                                    )
                                    .map((cert) => (
                                        <CertificateCard
                                            key={cert.id}
                                            certificate={cert}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="mt-8 text-right">
        <button className="text-blue-500 hover:text-blue-600 font-semibold underline">
          {t("certificates.view_all")}
        </button>
      </div> */}
        </div>
    );
};

const CertificateCard = ({ certificate }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <img
                src={certificate.Image}
                className="w-full h-48 object-cover rounded-xl mb-4"
                alt={certificate.title}
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {certificate.title}
            </h3>
            <p className="text-gray-600 mb-1">
                {t("certificates.issued_by")} {certificate.issuer}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                {new Date(certificate.issueDate).toLocaleDateString()}
            </p>
            <a
                href={certificate.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
                <ExternalLink className="w-4 h-4" />
                <span>{t("certificates.view_official")}</span>
            </a>
        </div>
    );
};

export default CertificatesProfileSection;
