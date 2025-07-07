import React from "react";
import MyApplicationCard from "../components/myApplications/MyApplicationCard";

function MyApplications() {
  const programData = {
    title: "France Programme",
    description:
      "Vel et sit sequi. Quos dolorem atque. Nisi autem ut eveniet qui molestiae nulla repellat. Repellendus nemo saepe. Laboriosam consequatur voluptas amet quibusdam. Et quaerat asperiores.",
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/cb2e6150f885f74036279cc11919609f3df5cfb2abbbf503204358a5ad8169f6?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of your program applications
          </p>
        </div>

        <div className="space-y-6">
          <MyApplicationCard program={programData} status="rejected" />
          <MyApplicationCard program={programData} status="accepted" />
          <MyApplicationCard program={programData} status="pending" />
        </div>
      </div>
    </main>
  );
}

export default MyApplications;
