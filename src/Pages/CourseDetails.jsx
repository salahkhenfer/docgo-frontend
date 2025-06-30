import { CourseContent } from "../components/course/CourseContent";
import { CourseHeader } from "../components/course/CourseHeader";

function CourseDetails() {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <main className="self-center mt-10 max-w-full w-[952px]">
        <CourseHeader />
        <CourseContent />
      </main>
    </div>
  );
}

export default CourseDetails;
