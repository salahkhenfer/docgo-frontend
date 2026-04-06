import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from "../../utils/apiClient";

export default function InternshipsList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    field: "",
    type: "all",
    isPaid: "all",
  });

  useEffect(() => {
    fetchInternships();
  }, [filters]);

  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: filters.search || undefined,
        field: filters.field || undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        isPaid:
          filters.isPaid !== "all"
            ? filters.isPaid === "paid"
              ? true
              : false
            : undefined,
      };

      const response = await apiClient.get("/other-services/internships", {
        params,
      });
      setInternships(response.data.data || []);
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/other-services")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Services
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            International Internships
          </h1>
          <p className="text-gray-600 mt-2">
            {internships.length} opportunities available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="font-bold text-lg mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search internships..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Field</label>
              <select
                value={filters.field}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    field: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Fields</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
              </select>
            </div>

            {/* Paid/Unpaid */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Payment
              </label>
              <select
                value={filters.isPaid}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    isPaid: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  field: "",
                  type: "all",
                  isPaid: "all",
                })
              }
              className="w-full px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">Loading internships...</div>
          ) : internships.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No internships found matching your criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {internships.map((internship) => (
                <div
                  key={internship.id}
                  onClick={() =>
                    navigate(`/other-services/internships/${internship.id}`)
                  }
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  <div className="flex">
                    {internship.introductoryImage && (
                      <img
                        src={internship.introductoryImage}
                        alt={internship.title}
                        className="w-32 h-32 object-cover"
                      />
                    )}
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {internship.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {internship.companyName} • {internship.location}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {internship.type}
                        </span>
                        {internship.field && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            {internship.field}
                          </span>
                        )}
                        {internship.isPaid ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            ${internship.price}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            Unpaid
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {internship.description?.replace(/<[^>]*>/g, "")}
                      </p>

                      {internship.applicationDeadline && (
                        <p className="text-sm text-gray-500 mt-2">
                          Apply by:{" "}
                          {new Date(
                            internship.applicationDeadline,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
