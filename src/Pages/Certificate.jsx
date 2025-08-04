import jsPDF from "jspdf";
import { Award, Calendar, Download, Eye, Star, User } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import generatePDFCertificate from "../components/certificate/generatePDFCertificate";

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

            // Add the Image to the PDF
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
        <div className="min-h-screen relative w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
            <div className="max-w-6xl relative mx-auto">
                {/* Congratulations Banner */}
                <div className="text-center mb-4 md:mb-8">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-4 md:p-8 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg md:shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <div className="bg-yellow-400 p-2 md:p-4 rounded-full">
                                    <Award className="w-6 h-6 md:w-12 md:h-12 text-yellow-800" />
                                </div>
                            </div>
                            <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">
                                🎉 Félicitations Exceptionnelles!
                            </h1>
                            <p className="text-sm md:text-xl mb-2 md:mb-4">
                                Vous avez brillamment terminé votre formation
                            </p>
                            <h2 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-yellow-200">
                                {certificateData.courseName}
                            </h2>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-sm md:text-lg">
                                <div className="flex items-center gap-1 md:gap-2">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                                    <span>
                                        Mention: {certificateData.grade}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-200" />
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
                <div className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 mb-4 md:mb-8 border border-gray-100">
                    <div
                        ref={certificateRef}
                        className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-12 rounded-xl md:rounded-2xl border-4 md:border-8 border-transparent bg-clip-padding"
                        style={{
                            background:
                                "linear-gradient(white, white) padding-box, linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) border-box",
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md md:shadow-lg">
                            <Award className="w-4 h-4 md:w-8 md:h-8 text-white" />
                        </div>

                        <div className="absolute top-2 md:top-4 left-2 md:left-4 w-6 h-6 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 md:w-6 md:h-6 text-white" />
                        </div>

                        <div className="text-center relative z-10">
                            {/* Header */}
                            <div className="mb-4 md:mb-8">
                                <h1 className="text-xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1 md:mb-2">
                                    CERTIFICAT D'EXCELLENCE
                                </h1>
                                <div className="w-16 h-0.5 md:w-32 md:h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-2 md:mb-4"></div>
                                <p className="text-sm md:text-xl text-gray-600 font-medium">
                                    est décerné à
                                </p>
                            </div>

                            {/* Student Name */}
                            <div className="mb-4 md:mb-8">
                                <div className="text-xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-1 md:mb-2">
                                    {certificateData.studentName}
                                </div>
                                <div className="w-24 h-0.5 md:w-48 md:h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto"></div>
                            </div>

                            {/* Course Description */}
                            <div className="mb-4 md:mb-8">
                                <p className="text-xs md:text-lg text-gray-700 mb-2 md:mb-4">
                                    pour avoir terminé avec succès le programme
                                    de formation
                                </p>
                                <h2 className="text-lg md:text-3xl font-bold text-gray-800 leading-tight">
                                    {certificateData.courseName}
                                </h2>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                                <div className="bg-white/80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg">
                                    <div className="text-base md:text-2xl font-bold text-blue-600">
                                        {certificateData.grade}
                                    </div>
                                    <div className="text-xs md:text-base text-gray-600 font-medium">
                                        Résultat Obtenu
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg">
                                    <div className="text-base md:text-2xl font-bold text-purple-600">
                                        {certificateData.courseHours}h
                                    </div>
                                    <div className="text-xs md:text-base text-gray-600 font-medium">
                                        Durée de Formation
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg">
                                    <div className="text-base md:text-2xl font-bold text-teal-600">
                                        {new Date(
                                            certificateData.completionDate
                                        ).toLocaleDateString("fr-FR")}
                                    </div>
                                    <div className="text-xs md:text-base text-gray-600 font-medium">
                                        Date d'Obtention
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-6 md:mt-12 space-y-4 md:space-y-0">
                                <div className="text-center">
                                    <div className="w-16 md:w-32 h-0.5 bg-gray-400 mb-1 md:mb-2"></div>
                                    <div className="text-sm md:text-base font-semibold text-gray-800">
                                        {certificateData.instructor}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600">
                                        Instructeur Certifié
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 md:w-32 h-0.5 bg-gray-400 mb-1 md:mb-2"></div>
                                    <div className="text-sm md:text-base font-semibold text-gray-800">
                                        {certificateData.institution}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600">
                                        Institution
                                    </div>
                                </div>
                            </div>

                            {/* Certificate ID */}
                            <div className="text-xs text-gray-500 text-right mt-2 md:mt-4">
                                ID: {certificateData.certificateId}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 md:gap-4 mt-4 md:mt-8 max-w-md mx-auto">
                        {/* Download Certificate Button */}
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="flex gap-2 md:gap-3 justify-center items-center px-4 py-2 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl md:rounded-2xl transition-all duration-300 font-semibold shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transform hover:-translate-y-0.5 md:hover:-translate-y-1 text-sm md:text-base"
                        >
                            {isDownloading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white"
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
                                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Télécharger le Certificat PDF</span>
                                </>
                            )}
                        </button>

                        {/* View Certificate Button */}
                        <button
                            onClick={() => setShowCertificate(!showCertificate)}
                            className="flex gap-2 md:gap-3 justify-center items-center px-4 py-2 md:px-8 md:py-3 text-blue-600 hover:text-purple-600 underline font-semibold transition-colors duration-300 text-sm md:text-base"
                        >
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
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
                    <div className="bg-white rounded-lg md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-6 mb-4 md:mb-8 border border-gray-100">
                        <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-6 flex items-center gap-2 md:gap-3">
                            <User className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                            Détails Complets du Certificat
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-4">
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Bénéficiaire:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {certificateData.studentName}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Formation:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {certificateData.courseName}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Institution:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {certificateData.institution}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 md:space-y-4">
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Date d'obtention:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {new Date(
                                            certificateData.completionDate
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Mention:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {certificateData.grade}
                                    </p>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 text-sm md:text-base">
                                        Instructeur:
                                    </label>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {certificateData.instructor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
