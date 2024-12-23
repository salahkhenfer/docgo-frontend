import { useEffect } from "react";

function Default() {
  // const { isAuth, userType } = useAppContext();

  //   useEffect(() => {
  //     //     if (!isAuth || !userType) {
  //     // navigate("/Home"); // If not authenticated or userType is missing, go to Home.
  //     //     } else if (userType === "teacher") {
  //     //         navigate("/Teacher"); // Navigate to the Teacher dashboard.
  //     //     } else if (userType === "student") {
  //     //         navigate("/Student"); // Navigate to the Student dashboard.
  //     //     } else {
  //     //         navigate("/Home"); // Default fallback to Home if conditions are unclear.
  //     //     }
  //   }, []); // Make sure to include dependencies here.

  // return null; // No need to return anything from this component.

  return (
    <div className="min-h-screen text-red-600 flex items-center justify-center text-2xl font-bold  ">
      <h1 className="text-2xl font-bold text-red-600"> Default Page</h1>
    </div>
  );
}

export default Default;
