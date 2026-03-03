import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const trimmed = email.trim();
        if (!trimmed) {
            setError("Veuillez entrer votre adresse e-mail.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError("Adresse e-mail invalide.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/forgot-password", { email: trimmed });
            setSubmitted(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Une erreur est survenue. Veuillez réessayer.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg
                            className="h-7 w-7 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M5.25 10.5h13.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z"
                            />
                        </svg>
                    </div>
                </div>

                {submitted ? (
                    /* ── Success state ─────────────────────────────── */
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center">
                                <svg
                                    className="h-7 w-7 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Demande reçue
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Votre demande a bien été enregistrée.
                            <br />
                            <span className="font-medium text-gray-800">
                                Un administrateur vous contactera prochainement
                            </span>{" "}
                            à l&apos;adresse e-mail que vous avez fournie.
                        </p>
                        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-left">
                            <p className="text-xs text-blue-700 leading-relaxed">
                                <strong>Note :</strong> Ce processus est manuel.
                                L&apos;équipe DocGo examinera votre demande et
                                vous enverra vos identifiants par e-mail dans
                                les meilleurs délais.
                            </p>
                        </div>
                        <Link
                            to="/Login"
                            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                        >
                            ← Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    /* ── Form state ────────────────────────────────── */
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                            Mot de passe oublié
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 text-center">
                            Entrez votre e-mail et un administrateur vous
                            contactera.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresse e-mail
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition text-sm flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
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
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                )}
                                {loading
                                    ? "Envoi en cours…"
                                    : "Envoyer la demande"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Vous vous souvenez de votre mot de passe ?{" "}
                            <Link
                                to="/Login"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
