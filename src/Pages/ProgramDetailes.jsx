import React, { useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useDraggable,
} from "@heroui/react";
import { t } from "i18next";
import Payment from "../components/Payment/Payment";

export function ProgramDetails() {
  const [isPlaying, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const targetRef = React.useRef(null);
  const { moveProps } = useDraggable({
    targetRef,
    canOverflow: true,
    isDisabled: !isOpen,
  });

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const handleToggle = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  return (
    <section className="relative z-10 w-full bg-gradient-to-b xl:px-10">
      <div className="py-6">
        <div className="relative mx-auto mt-6 h-64 w-full max-w-[860px] overflow-hidden rounded-[48px] bg-gray-200 shadow-md transition duration-300 hover:shadow-lg md:h-80 lg:h-[420px]">
          <video
            className="h-full w-full object-cover"
            ref={videoRef}
            src="https://cdn.pixabay.com/video/2024/05/31/214592_large.mp4"
          />
          <div
            role="button"
            onClick={handleToggle}
            className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
          >
            <div
              className={`z-20 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white transition-all duration-500 md:h-20 md:w-20 ${
                isPlaying ? "invisible select-none opacity-0" : ""
              }`}
            >
              {isPlaying ? (
                <svg
                  viewBox="0 0 512 512"
                  className="h-12 w-12 md:h-16 md:w-16"
                >
                  <path
                    d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                  />
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                    d="M208 192v128M304 192v128"
                  />
                </svg>
              ) : (
                <svg
                  className="h-12 w-12 md:h-16 md:w-16"
                  stroke="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth="32"
                  />
                  <path
                    d="M216.32 334.44l114.45-69.14a10.89 10.89 0 000-18.6l-114.45-69.14a10.78 10.78 0 00-16.32 9.31v138.26a10.78 10.78 0 0016.32 9.31z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 py-6">
        <h2 className="text-3xl font-bold text-center">Program Title</h2>
        <p className="text-lg text-center">Program Description</p>
        <Button
          color="primary"
          className=" mx-auto flex justify-center items-center "
          onPress={onOpen}
        >
          {t("ApplyInProgram")}
        </Button>
      </div>

      {/* Full Screen Modal Implementation */}
      <Modal
        size="full" // Set modal size to full
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        className="max-w-full m-0 h-screen"
      >
        <ModalContent className="m-0 h-full max-h-screen w-full max-w-none rounded-none">
          {(onClose) => (
            <div className="flex flex-col h-full">
              <ModalHeader
                {...moveProps}
                className="flex items-center justify-between px-6 py-4 border-b"
              >
                <span>{t("ApplicationForm")}</span>
              </ModalHeader>

              <ModalBody className="flex-1 overflow-auto p-6">
                <Payment />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
