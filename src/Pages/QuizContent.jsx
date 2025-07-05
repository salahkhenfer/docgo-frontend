import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

// Question Components
const MultipleChoiceQuestion = ({
  question,
  selectedAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {question.text}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              {option.id}. {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const CheckboxQuestion = ({ question, selectedAnswers, onAnswerChange }) => {
  const handleCheckboxChange = (optionId) => {
    const newSelected = selectedAnswers.includes(optionId)
      ? selectedAnswers.filter((id) => id !== optionId)
      : [...selectedAnswers, optionId];
    onAnswerChange(question.id, newSelected);
  };

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {question.text}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option.id)}
              onChange={() => handleCheckboxChange(option.id)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              {option.id}. {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const TextAreaQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {question.text}
      </h3>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
        placeholder="Tapez votre réponse ici..."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows="4"
      />
    </div>
  );
};

const QuizResults = ({ results, onRetry }) => {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Résultats du Quiz
        </h2>
        <div
          className="text-4xl font-bold mb-2"
          style={{
            color:
              score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444",
          }}
        >
          {score}%
        </div>
        <p className="text-gray-600">
          {correctAnswers} sur {totalQuestions} questions correctes
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={result.questionId}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              {result.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">
                  Question {index + 1}: {result.questionText}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Votre réponse:</strong> {result.userAnswer}
                  </p>
                  {!result.isCorrect && (
                    <p>
                      <strong>Réponse correcte:</strong> {result.correctAnswer}
                    </p>
                  )}
                  {result.feedback && (
                    <p className="text-blue-600 mt-2">{result.feedback}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Recommencer le Quiz
        </button>
      </div>
    </div>
  );
};

function QuizContent() {
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const quizData = {
    sections: [
      {
        title: "1) Choisissez la bonne réponse",
        type: "multiple-choice",
        questions: [
          {
            id: "q1",
            text: "Lequel des éléments suivants N'EST PAS un principe clé du design ?",
            correctAnswer: "D",
            options: [
              { id: "A", label: "Contraste" },
              { id: "B", label: "Répétition" },
              { id: "C", label: "Alignement" },
              { id: "D", label: "Dissonance" },
            ],
          },
        ],
      },
      {
        title:
          "Pourquoi la recherche utilisateur est-elle importante dans le processus de design ?",
        type: "checkbox",
        instructions: "Vous pouvez sélectionner plus de deux options",
        questions: [
          {
            id: "q2",
            text: "Pourquoi la recherche utilisateur est-elle importante dans le processus de design ?",
            correctAnswer: ["B", "D"],
            options: [
              { id: "A", label: "Elle est coûteuse" },
              { id: "B", label: "Elle permet de comprendre les besoins réels" },
              { id: "C", label: "Elle remplace les tests" },
              { id: "D", label: "Elle améliore la satisfaction utilisateur" },
            ],
          },
        ],
      },
      {
        title: "2) Répondez brièvement à ces questions",
        type: "text",
        questions: [
          {
            id: "q3",
            text: "Qu'est-ce que le design thinking ?",
            correctAnswer:
              "Une approche centrée sur l'utilisateur pour résoudre des problèmes",
          },
          {
            id: "q4",
            text: "Citez deux avantages clés du prototypage dans le processus de design ?",
            correctAnswer:
              "Permet de tester rapidement les idées et d'identifier les problèmes tôt",
          },
        ],
      },
    ],
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const validateAnswers = async (answers) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const results = [];

    quizData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        const correctAnswer = question.correctAnswer;
        let isCorrect = false;
        let feedback = "";

        if (section.type === "multiple-choice") {
          isCorrect = userAnswer === correctAnswer;
          feedback = isCorrect
            ? "Bonne réponse !"
            : `La bonne réponse était "${correctAnswer}".`;
        } else if (section.type === "checkbox") {
          const userSet = new Set(userAnswer || []);
          const correctSet = new Set(correctAnswer);
          isCorrect =
            userSet.size === correctSet.size &&
            [...userSet].every((x) => correctSet.has(x));
          feedback = isCorrect
            ? "Bonne réponse !"
            : `Les bonnes réponses étaient: ${correctAnswer.join(", ")}.`;
        } else if (section.type === "text") {
          isCorrect =
            userAnswer &&
            userAnswer
              .toLowerCase()
              .includes(correctAnswer.toLowerCase().split(" ")[0]);
          feedback = isCorrect
            ? "Bonne réponse !"
            : "Votre réponse pourrait être améliorée.";
        }

        results.push({
          questionId: question.id,
          questionText: question.text,
          userAnswer: Array.isArray(userAnswer)
            ? userAnswer.join(", ")
            : userAnswer || "Pas de réponse",
          correctAnswer: Array.isArray(correctAnswer)
            ? correctAnswer.join(", ")
            : correctAnswer,
          isCorrect,
          feedback,
        });
      });
    });

    return results;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const allQuestions = quizData.sections.flatMap(
        (section) => section.questions
      );
      const unansweredQuestions = allQuestions.filter(
        (q) => !userAnswers[q.id] || userAnswers[q.id].length === 0
      );

      if (unansweredQuestions.length > 0) {
        await Swal.fire({
          icon: "warning",
          title: "Questions incomplètes",
          text: "Veuillez répondre à toutes les questions avant de soumettre.",
          confirmButtonColor: "#3b82f6",
        });
        setIsLoading(false);
        return;
      }

      const validationResults = await validateAnswers(userAnswers);
      const correctAnswers = validationResults.filter(
        (r) => r.isCorrect
      ).length;
      const totalQuestions = validationResults.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      // 🎉 Congratulation popup if score > 50%
      if (score >= 50) {
        await Swal.fire({
          icon: "success",
          title: "Félicitations ! 🎉",
          html: `<strong>Vous avez obtenu ${score}%</strong><br />Vous pouvez obtenir votre certificat.`,
          confirmButtonText: "Voir mes résultats",
          confirmButtonColor: "#10b981",
        });
      }

      setResults(validationResults);
      setIsSubmitted(true);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de la validation. Veuillez réessayer.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setResults([]);
  };

  if (isSubmitted) {
    return (
      <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
        <QuizResults results={results} onRetry={handleRetry} />
      </main>
    );
  }

  return (
    <main className="ml-5 w-[72%] max-md:ml-0 max-md:w-full">
      <div className="overflow-hidden w-full max-md:mt-8 max-md:max-w-full">
        {quizData.sections.map((section, idx) => (
          <section key={idx} className="mt-10 w-full max-md:max-w-full">
            <h1 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
              {section.title}
            </h1>
            {section.instructions && (
              <p className="text-base text-gray-600 mt-2">
                {section.instructions}
              </p>
            )}
            {section.questions.map((question) => {
              if (section.type === "multiple-choice") {
                return (
                  <MultipleChoiceQuestion
                    key={question.id}
                    question={question}
                    selectedAnswer={userAnswers[question.id] || ""}
                    onAnswerChange={handleAnswerChange}
                  />
                );
              }
              if (section.type === "checkbox") {
                return (
                  <CheckboxQuestion
                    key={question.id}
                    question={question}
                    selectedAnswers={userAnswers[question.id] || []}
                    onAnswerChange={handleAnswerChange}
                  />
                );
              }
              if (section.type === "text") {
                return (
                  <TextAreaQuestion
                    key={question.id}
                    question={question}
                    answer={userAnswers[question.id] || ""}
                    onAnswerChange={handleAnswerChange}
                  />
                );
              }
              return null;
            })}
          </section>
        ))}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex gap-2 justify-center items-center px-8 py-3 mt-10 max-w-full text-base text-white bg-blue-500 rounded-[56px] w-[275px] max-md:px-5 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>Validation...</span>
            </>
          ) : (
            <span>Complet</span>
          )}
        </button>
      </div>
    </main>
  );
}

export default QuizContent;
