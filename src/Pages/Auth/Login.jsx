import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import InlineLoading from "../../InlineLoading";
import Swal from "sweetalert2";
import axios from "axios";
const Login = () => {
    const backgroundImage = "../../../src/assets/Login.png";
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { set_Auth, set_user } = useAppContext();

    // Handle form field changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    // Handle login submission
    const handleLogin = useCallback(
        async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");

            // Basic validation
            if (!formData.email || !formData.password) {
                setError("Veuillez remplir tous les champs requis");
                setLoading(false);
                return;
            }

            try {
                // Replace with your actual login API endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/Login`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                console.log("respose from the login  : ", response.data);
                const data = response.data;

                if (response.status !== 200 || response.status > 299) {
                    throw new Error(data.message || "Échec de la connexion");
                }

                // Success - update auth context
                set_Auth(true);
                set_user(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                sessionStorage.setItem("user", JSON.stringify(data.user));
                Swal.fire({
                    title: "Connexion réussie",
                    text: "Vous êtes maintenant connecté.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                // Redirect to dashboard or home page
                navigate("/Profile");
            } catch (err) {
                setError(
                    err.message ||
                        "Une erreur est survenue lors de la connexion"
                );
            } finally {
                setLoading(false);
            }
        },
        [formData, navigate, set_Auth, set_user]
    );

    return (
        <div className="flex items-center h-screen">
            <div className="hidden lg:flex md:w-1/2 relative">
                <div className="absolute inset-0 from-black/40 to-transparent"></div>
                <div className="w-[80%] h-full px-16">
                    <img
                        src={backgroundImage}
                        alt="Airplane in sky"
                        className="3xl:w-full 3xl:h-full md:max-2xl:w-[400px] xl:max-2xl:h-full object-cover"
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-2">Se connecter</h2>
                    <p className="text-gray-600 mb-6">
                        Bienvenue à Docgo. Si possible signer sur votre compte
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Votre email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Votre mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <InlineLoading borderColor="white" />
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                {/* <span className="px-2 bg-white text-gray-500">
                                    OU
                                </span> */}
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Vous n'avez pas de compte?
                            <a
                                href="/Register"
                                className="text-blue-500 hover:underline ml-1"
                            >
                                S'inscrire
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
