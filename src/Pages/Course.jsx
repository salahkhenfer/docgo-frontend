import { Outlet, useParams } from "react-router-dom";

function Course() {
  return (
    <div className="relative mx-auto flex flex-col items-center justify-center w-full h-full bg-white md:mt-16 mt-6">
      <Outlet />
    </div>
  );
}

export default Course;
