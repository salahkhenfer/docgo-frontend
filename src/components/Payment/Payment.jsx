import React, { useState } from "react";

import CardDetailsForm from "./CardDetailsForm";
import BaridiMobForm from "./BaridiMobForm";

const Payment = () => {
  const [methodePaiement, setMethodePaiement] = useState("visa");

  return (
    <main className="flex  flex-wrap gap-10   items-start px-20 justify-center   w-full bg-white max-md:px-5">
      <section className="flex flex-col self-start max-md:max-w-full">
        {methodePaiement === "baridiMob" ? (
          <CardDetailsForm />
        ) : (
          <BaridiMobForm />
        )}
      </section>

      <aside className="flex flex-col items-start max-w-full w-[416px]">
        <section className="max-w-full w-[311px]">
          <h2 className="text-base leading-relaxed text-zinc-800">
            choisissez votre methode de paiement
          </h2>
          <div className="flex gap-4 items-center mt-4 w-full">
            <button className="flex gap-2 items-center self-stretch my-auto w-[94px]">
              <div className="flex flex-col justify-center self-stretch p-1.5 my-auto bg-sky-50 rounded-2xl border border-solid w-[94px]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec4b9f8d9b703febf8b188631f45fd1e2677e01f746e06f68f6fea86a813530b?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3"
                  alt="Payment method 1"
                  className="object-contain w-full aspect-[1.78]"
                />
              </div>
            </button>
            <button className="flex gap-2 items-center self-stretch my-auto w-[94px]">
              <div className="flex gap-1.5 justify-center items-center self-stretch p-1.5 my-auto rounded-2xl border border-solid w-[94px]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/7376212805dc227f9035e4c3490af46054730168a65f266c143884a1ab8bfe77?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3"
                  alt="Payment method 2"
                  className="object-contain self-stretch my-auto aspect-square w-[46px]"
                />
              </div>
            </button>
          </div>
        </section>{" "}
        <section className="mt-8 max-w-full">
          <div className="max-w-full text-zinc-800 w-[262px]">
            <h2 className="text-2xl leading-10">Montant du paiement</h2>
            <p className="mt-1.5 text-4xl font-semibold">7652$</p>
          </div>
        </section>
      </aside>
    </main>
  );
};

export default Payment;
