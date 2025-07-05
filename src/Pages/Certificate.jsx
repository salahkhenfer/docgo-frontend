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

export default function Certificate() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);

  // Mock certificate data - replace with your actual data
  const certificateData = {
    studentName: " salah khenfer",
    courseName: "Advanced React Development & Modern JavaScript",
    completionDate: "2024-12-15",
    instructor: "Dr. imad ",
    grade: "Excellence",
    courseHours: "120",

    certificateId: "CERT-2024-RD-001",
    institution: "DocGo ",
  };

  const generatePDF = async () => {
    // Create a new canvas element for PDF generation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions for A4 size (at 300 DPI)
    canvas.width = 2480; // A4 width at 300 DPI
    canvas.height = 3508; // A4 height at 300 DPI

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create gradient border
    const borderGradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    borderGradient.addColorStop(0, "#3b82f6");
    borderGradient.addColorStop(0.25, "#8b5cf6");
    borderGradient.addColorStop(0.5, "#06b6d4");
    borderGradient.addColorStop(0.75, "#10b981");
    borderGradient.addColorStop(1, "#3b82f6");

    // Draw border
    ctx.lineWidth = 30;
    ctx.strokeStyle = borderGradient;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Draw decorative circle
    const decorativeGradient = ctx.createRadialGradient(
      2100,
      300,
      0,
      2100,
      300,
      100
    );
    decorativeGradient.addColorStop(0, "#fbbf24");
    decorativeGradient.addColorStop(1, "#f59e0b");
    ctx.fillStyle = decorativeGradient;
    ctx.beginPath();
    ctx.arc(2100, 300, 100, 0, 2 * Math.PI);
    ctx.fill();

    // Draw trophy emoji (simplified as text)
    ctx.font = "80px serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("🏆", 2100, 330);

    // Main title
    ctx.font = "bold 120px serif";
    const titleGradient = ctx.createLinearGradient(0, 500, canvas.width, 500);
    titleGradient.addColorStop(0, "#1e40af");
    titleGradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = titleGradient;
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICAT D'EXCELLENCE", canvas.width / 2, 500);

    // Subtitle
    ctx.font = "60px serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("est décerné à", canvas.width / 2, 650);

    // Student name
    ctx.font = "bold 100px serif";
    const nameGradient = ctx.createLinearGradient(0, 800, canvas.width, 800);
    nameGradient.addColorStop(0, "#059669");
    nameGradient.addColorStop(1, "#0d9488");
    ctx.fillStyle = nameGradient;
    ctx.fillText(certificateData.studentName, canvas.width / 2, 800);

    // Course description
    ctx.font = "50px serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(
      "pour avoir terminé avec succès le programme de formation",
      canvas.width / 2,
      950
    );

    // Course name
    ctx.font = "bold 70px serif";
    ctx.fillStyle = "#1f2937";
    const courseLines = certificateData.courseName.split(" ");
    let line1 = "";
    let line2 = "";
    const maxWidth = 1800;

    for (let i = 0; i < courseLines.length; i++) {
      const testLine = line1 + courseLines[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        line2 = courseLines.slice(i).join(" ");
        break;
      }
      line1 = testLine;
    }

    if (line2) {
      ctx.fillText(line1.trim(), canvas.width / 2, 1100);
      ctx.fillText(line2, canvas.width / 2, 1200);
    } else {
      ctx.fillText(line1.trim(), canvas.width / 2, 1150);
    }

    // Details section
    const detailsY = line2 ? 1400 : 1350;
    ctx.font = "bold 50px serif";
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(certificateData.grade, canvas.width / 2 - 600, detailsY);
    ctx.fillText(certificateData.courseHours + "h", canvas.width / 2, detailsY);
    ctx.fillText(
      new Date(certificateData.completionDate).toLocaleDateString("fr-FR"),
      canvas.width / 2 + 600,
      detailsY
    );

    ctx.font = "35px serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Résultat", canvas.width / 2 - 600, detailsY + 60);
    ctx.fillText("Durée", canvas.width / 2, detailsY + 60);
    ctx.fillText("Date", canvas.width / 2 + 600, detailsY + 60);

    // Skills section
    const skillsY = detailsY + 200;
    ctx.font = "bold 40px serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("Compétences acquises:", canvas.width / 2, skillsY);

    // Draw skill tags
    ctx.font = "35px serif";
    ctx.fillStyle = "#ffffff";
    const skillsPerRow = 3;
    const skillWidth = 400;
    const skillHeight = 80;
    const startX =
      (canvas.width - (skillsPerRow * skillWidth + (skillsPerRow - 1) * 50)) /
      2;

    certificateData.skills.forEach((skill, index) => {
      const row = Math.floor(index / skillsPerRow);
      const col = index % skillsPerRow;
      const x = startX + col * (skillWidth + 50);
      const y = skillsY + 80 + row * (skillHeight + 30);

      // Draw skill background
      const skillGradient = ctx.createLinearGradient(
        x,
        y,
        x + skillWidth,
        y + skillHeight
      );
      skillGradient.addColorStop(0, "#3b82f6");
      skillGradient.addColorStop(1, "#8b5cf6");
      ctx.fillStyle = skillGradient;
      ctx.fillRect(x, y, skillWidth, skillHeight);

      // Draw skill text
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(skill, x + skillWidth / 2, y + skillHeight / 2 + 10);
    });

    // Signatures
    const signaturesY = canvas.height - 600;
    ctx.font = "bold 45px serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";

    // Instructor signature
    ctx.fillText(
      certificateData.instructor,
      canvas.width / 2 - 500,
      signaturesY
    );
    ctx.font = "35px serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(
      "Instructeur Certifié",
      canvas.width / 2 - 500,
      signaturesY + 50
    );

    // Institution signature
    ctx.font = "bold 45px serif";
    ctx.fillStyle = "#374151";
    ctx.fillText(
      certificateData.institution,
      canvas.width / 2 + 500,
      signaturesY
    );
    ctx.font = "35px serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Institution", canvas.width / 2 + 500, signaturesY + 50);

    // Draw signature lines
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 700, signaturesY - 30);
    ctx.lineTo(canvas.width / 2 - 300, signaturesY - 30);
    ctx.moveTo(canvas.width / 2 + 300, signaturesY - 30);
    ctx.lineTo(canvas.width / 2 + 700, signaturesY - 30);
    ctx.stroke();

    // Certificate ID
    ctx.font = "30px serif";
    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "right";
    ctx.fillText(
      `ID: ${certificateData.certificateId}`,
      canvas.width - 100,
      canvas.height - 100
    );

    return canvas;
  };
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generatePDF();

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Calculate dimensions to fit the A4 page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `certificat-${certificateData.studentName
          .replace(/\s+/g, "-")
          .toLowerCase()}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
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
              <Download className="w-5 h-5" />
              <span>
                {isDownloading
                  ? "Génération du PDF..."
                  : "Télécharger le Certificat PDF"}
              </span>
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
