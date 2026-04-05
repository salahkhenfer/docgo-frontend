import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function OtherServices() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cvService, setCVService] = useState(null);
  const [internshipCount, setInternshipCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [cvRes, internshipsRes] = await Promise.all([
        axios.get("/api/other-services/cv-service"),
        axios.get("/api/other-services/internships"),
      ]);

      setCVService(cvRes.data.data);
      setInternshipCount(internshipsRes.data.count || 0);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading services...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Explore professional services designed to advance your career
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* CV Service Card */}
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => navigate("/other-services/cv")}
          >
            {cvService?.introductoryImage && (
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={cvService.introductoryImage}
                  alt="CV Service"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                {cvService?.title || "Professional CV Creation"}
              </h2>
              <p className="text-gray-600 mb-4">
                Get your professional CV created by experts. Perfect for job
                seekers looking to make a great first impression.
              </p>
              {cvService?.estimatedPrice && (
                <p className="text-lg font-semibold text-blue-600 mb-4">
                  Starting at ${cvService.estimatedPrice}
                </p>
              )}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Get Started →
              </button>
            </div>
          </div>

          {/* Internships Card */}
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => navigate("/other-services/internships")}
          >
            <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-2">💼</div>
                <p className="text-2xl font-bold">Internship Opportunities</p>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                International Internships
              </h2>
              <p className="text-gray-600 mb-4">
                Explore internship opportunities around the world. Build your
                experience with leading companies globally.
              </p>
              <p className="text-lg font-semibold text-green-600 mb-4">
                {internshipCount} active opportunities
              </p>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Browse Internships →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✅",
                title: "Verified Opportunities",
                desc: "All positions are verified and from reputable companies",
              },
              {
                icon: "🌍",
                title: "Global Reach",
                desc: "Access opportunities around the world",
              },
              {
                icon: "📞",
                title: "Personal Support",
                desc: "Get personalized guidance throughout your journey",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl mb-8">
            Whether you need a professional CV or an internship abroad, we're
            here to help.
          </p>
          <button
            onClick={() => navigate("/other-services/my-applications")}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            View My Applications
          </button>
        </div>
      </div>
    </div>
  );
}
