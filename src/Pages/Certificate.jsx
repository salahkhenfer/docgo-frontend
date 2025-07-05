"use client";
import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import {
  Download,
  Share2,
  Eye,
  FileText,
  Award,
  Star,
  Calendar,
  User,
} from "lucide-react";
import generatePDFCertificate from "../components/certificate/generatePDFCertificate";
import Swal from "sweetalert2";

export default function Certificate() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);

  // Mock certificate data - replace with your actual data
  const certificateData = {
    studentName: "salah khenfer",
    courseName: "Advanced React Development & Modern JavaScript",
    completionDate: "2024-12-15",
    instructor: "Dr. imad",
    grade: "Excellence",
    courseHours: "120",
    certificateId: "CERT-2024-RD-001",
    institution: "DocGo",
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      // Show loading alert
      Swal.fire({
        title: "Génération du certificat",
        html: "Veuillez patienter pendant la création de votre certificat...",
        allowOutsideClick: false,
      });

      // Generate the canvas with the certificate
      const canvas = await generatePDFCertificate(certificateData);

      // Convert canvas to compressed JPEG
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);

      // Close the loading dialog
      Swal.close();

      // Show success alert
      await Swal.fire({
        title: "Téléchargement réussi!",
        text: "Votre certificat a été généré avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Safe filename generation
      const fileName = certificateData?.studentName
        ? `certificat-${certificateData.studentName
            .replace(/\s+/g, "-")
            .toLowerCase()}.pdf`
        : "certificat.pdf";

      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la génération du certificat.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Congratulations Banner */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-8 rounded-2xl mb-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-400 p-4 rounded-full">
                  <Award className="w-12 h-12 text-yellow-800" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">
                🎉 Félicitations Exceptionnelles!
              </h1>
              <p className="text-xl mb-4">
                Vous avez brillamment terminé votre formation
              </p>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-200">
                {certificateData.courseName}
              </h2>
              <div className="flex justify-center items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>Mention: {certificateData.grade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <span>
                    {new Date(
                      certificateData.completionDate
                    ).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-2xl border-8 border-transparent bg-clip-padding"
            style={{
              background:
                "linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) border-box",
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>

            <div className="text-center relative z-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  CERTIFICAT D'EXCELLENCE
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 font-medium">
                  est décerné à
                </p>
              </div>

              {/* Student Name */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                  {certificateData.studentName}
                </div>
                <div className="w-48 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto"></div>
              </div>

              {/* Course Description */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  pour avoir terminé avec succès le programme de formation
                </p>
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  {certificateData.courseName}
                </h2>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {certificateData.grade}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Résultat Obtenu
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {certificateData.courseHours}h
                  </div>
                  <div className="text-gray-600 font-medium">
                    Durée de Formation
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-teal-600">
                    {new Date(
                      certificateData.completionDate
                    ).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Date d'Obtention
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-12">
                <div className="text-center">
                  <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                  <div className="font-semibold text-gray-800">
                    {certificateData.instructor}
                  </div>
                  <div className="text-sm text-gray-600">
                    Instructeur Certifié
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                  <div className="font-semibold text-gray-800">
                    {certificateData.institution}
                  </div>
                  <div className="text-sm text-gray-600">Institution</div>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="text-xs text-gray-500 text-right mt-4">
                ID: {certificateData.certificateId}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-8 max-w-md mx-auto">
            {/* Download Certificate Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex gap-3 justify-center items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Télécharger le Certificat PDF</span>
                </>
              )}
            </button>

            {/* View Certificate Button */}
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="flex gap-3 justify-center items-center px-8 py-3 text-blue-600 hover:text-purple-600 underline font-semibold transition-colors duration-300"
            >
              <Eye className="w-5 h-5" />
              <span>
                {showCertificate
                  ? "Masquer les Détails"
                  : "Voir les Détails du Certificat"}
              </span>
            </button>
          </div>
        </div>

        {/* Certificate Details (expandable) */}
        {showCertificate && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              Détails Complets du Certificat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Bénéficiaire:
                  </label>
                  <p className="text-gray-600">{certificateData.studentName}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Formation:
                  </label>
                  <p className="text-gray-600">{certificateData.courseName}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Institution:
                  </label>
                  <p className="text-gray-600">{certificateData.institution}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Date d'obtention:
                  </label>
                  <p className="text-gray-600">
                    {new Date(
                      certificateData.completionDate
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Mention:
                  </label>
                  <p className="text-gray-600">{certificateData.grade}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Instructeur:
                  </label>
                  <p className="text-gray-600">{certificateData.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
