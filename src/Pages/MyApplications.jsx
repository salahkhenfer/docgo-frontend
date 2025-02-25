import React from "react";
import { MyApplicationCard } from "../components/myApplications/MyApplicationCard";

function MyApplications() {
  const programData = {
    title: "France programme",
    description:
      "Vel et sit sequi. Quos dolorem atque. Nisi autem ut eveniet qui molestiae nulla repellat. Repellendus nemo saepe. Laboriosam consequatur voluptas amet quibusdam. Et quaerat asperiores.",
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/cb2e6150f885f74036279cc11919609f3df5cfb2abbbf503204358a5ad8169f6?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3",
  };

  return (
    <main className="flex overflow-hidden flex-col pb-16 bg-white">
      <section className="self-center mt-12 w-full max-w-[1290px] max-md:mt-10 max-md:max-w-full">
        <MyApplicationCard program={programData} status="rejected" />
        <div className="mt-8">
          <MyApplicationCard program={programData} status="accepted" />
        </div>
        <div className="mt-8">
          <MyApplicationCard program={programData} status="pending" />
        </div>
      </section>
    </main>
  );
}

export default MyApplications;
