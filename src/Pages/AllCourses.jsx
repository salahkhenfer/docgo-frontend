import { useState } from "react";
import { CourseGrid } from "../components/courses/CourseGrid";
import { SearchFilters } from "../components/courses/SearchFilters";

export default function AllCourses() {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: "",
        price: "free",
        certificate: "with",
        date: "latest",
        sortBy: "createdAt",
        order: "DESC",
    });

    const handleFiltersChange = (newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1, // Reset to first page when filters change
        }));
    };

    return (
        <div className="overflow-hidden bg-white">
            <main className="flex flex-col pl-8 mt-14 w-full max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                <SearchFilters onFiltersChange={handleFiltersChange} />
                <CourseGrid filters={filters} />
            </main>
        </div>
    );
}
