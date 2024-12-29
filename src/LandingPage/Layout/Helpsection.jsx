import DarkColorButton from "../../components/Buttons/DarkColorButton";

function HelpSection() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
      <div className=" rounded-2xl shadow-lg  overflow-hidden">
        <div className="flex flex-col md:flex-row  bg-[#F4F4F5] backdrop-blur-[400px]">
          <div className="w-full md:w-1/2 relative">
            <img
              src="../../../src/assets/beautiful girl contact us.png"
              alt="contact us"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: "300px" }}
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 bg-[#F4F4F5] backdrop-blur-[400px] ">
            <form className="flex flex-col gap-6 ">
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-customGray font-medium">
                  Si vous avez des questions
                </p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl text-customGray font-medium">
                  Nous serions ravis de vous aider
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                  placeholder="Prénom"
                  type="text"
                />
                <input
                  className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                  placeholder="Nom de famille"
                  type="text"
                />
              </div>

              <input
                className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500"
                placeholder="Email"
                type="email"
              />

              <textarea
                className="w-full p-3 border border-gray-200 bg-[#F4F4F5] backdrop-blur-[400px] rounded-lg placeholder-customGray focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
                placeholder="Votre message"
              />

              <DarkColorButton style="w-full py-3 px-6" text="Envoyer" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSection;
