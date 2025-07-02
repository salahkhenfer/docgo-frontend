import React from "react";
import MultipleChoiceQuestion from "../components/quiz/MultipleChoiceQuestion";
import CheckboxQuestion from "../components/quiz/CheckboxQuestion";
import TextAreaQuestion from "../components/quiz/TextAreaQuestion";
import DragDropQuestion from "../components/quiz/DragDropQuestion";

function QuizContent() {
  return (
    <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
      <div className="overflow-hidden w-full max-md:mt-8 max-md:max-w-full">
        <section className="w-full max-md:max-w-full">
          <h1 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
            1 ) Choisissez la bonne réponse
          </h1>
          <MultipleChoiceQuestion />
          <CheckboxQuestion />
        </section>

        <section className="mt-10 w-full max-md:max-w-full">
          <h1 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
            2 ) Répondez brièvement à ces questions
          </h1>
          <TextAreaQuestion question="Lequel des éléments suivants N'EST PAS un principe clé du design ?" />
          <TextAreaQuestion question="Citez deux avantages clés du prototypage dans le processus de design ?" />
        </section>

        {/* <DragDropQuestion /> */}

        <button className="flex gap-2 justify-center items-center px-8 py-3 mt-10 max-w-full text-base leading-relaxed text-sky-50 whitespace-nowrap bg-blue-500 rounded-[56px] w-[275px] max-md:px-5">
          <div className="self-stretch my-auto text-sky-50">Complet</div>
        </button>
      </div>
    </main>
  );
}

export default QuizContent;
