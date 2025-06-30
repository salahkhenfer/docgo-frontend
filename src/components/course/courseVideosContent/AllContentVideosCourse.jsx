import { CourseSidebar } from "./CourseSidebar";
import { CourseVideosContent } from "./CourseVideosContent";

function AllContentVideosCourse() {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <div className="mt-10 w-full max-w-[1360px] max-md:max-w-full" space={32}>
        <div className="flex gap-5 max-md:flex-col max-md:">
          <CourseSidebar />
          <CourseVideosContent />
        </div>
      </div>
    </div>
  );
}

export default AllContentVideosCourse;
