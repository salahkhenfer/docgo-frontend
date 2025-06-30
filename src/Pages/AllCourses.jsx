import { CourseGrid } from "../components/courses/CourseGrid";
import { SearchFilters } from "../components/courses/SearchFilters";

export default function AllCourses() {
  return (
    <div className="overflow-hidden bg-white">
      <main className="flex flex-col pl-8 mt-14 w-full max-md:pl-5 max-md:mt-10 max-md:max-w-full">
        <SearchFilters />
        <CourseGrid />
      </main>
    </div>
  );
}
