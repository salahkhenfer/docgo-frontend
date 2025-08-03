import { useRef, useState } from "react";

const BaridiMobForm = () => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null); // State to store the file name

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
            setFileName(file.name); // Update the file name state
            // You can handle the file upload logic here
        }
    };

    return (
        <main className="max-w-[400px] mx-auto p-4  flex flex-col justify-start">
            <header className="w-full mb-6">
                <h1 className="text-3xl font-semibold text-zinc-800">
                    Processus de paiement
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                    N'hésitez pas, complétez votre processus de paiement et
                    commencez votre voyage maintenant avec nous
                </p>
            </header>

            <section
                className="flex flex-col items-center p-6 text-sm text-center rounded-2xl border border-blue-600 border-dashed"
                aria-labelledby="upload-title"
            >
                <h2 id="upload-title" className="text-zinc-800">
                    Télécharger le fichier
                </h2>
                <img
                    src="https://cdn.builder.io/api/v1/Image/assets/TEMP/90d6207c9595f421b21f613a50561a7aa8316d57879a833387e2269fc2ae6a1d?placeholderIfAbsent=true&apiKey=ce15f09aba8c461ea95db36c370d18d3"
                    alt="Upload icon"
                    className="object-contain mt-2 w-8 aspect-square"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    aria-label="File upload input"
                />
                <button
                    onClick={handleFileSelect}
                    className="mt-2 font-semibold text-blue-600 underline underline-offset-auto cursor-pointer text-sm"
                >
                    sélectionnez le fichier
                </button>
            </section>

            {/* Display the uploaded file name */}
            {fileName && (
                <div className="mt-4 text-sm text-neutral-600">
                    Fichier sélectionné :{" "}
                    <span className="font-semibold">{fileName}</span>
                </div>
            )}

            <button
                className="w-full px-6 py-2 mt-6 text-sm font-semibold text-sky-50 bg-blue-500 rounded-[56px] hover:bg-blue-600 transition-colors"
                type="submit"
            >
                Terminer le paiement
            </button>
        </main>
    );
};

export default BaridiMobForm;
