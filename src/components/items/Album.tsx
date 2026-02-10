import { motion } from "framer-motion";
import Image from "next/image";

interface AlbumProps {
  isPlaying: boolean;
  isLoading: boolean;
  kickIntensity: number;
  currentColorRGB: string;
}

export const Album = ({
  isPlaying,
  isLoading,
  kickIntensity,
  currentColorRGB,
}: AlbumProps) => {
  return (
    <motion.div
      animate={{
        border: isLoading
          ? "#0F0F0F"
          : isPlaying
            ? `2px solid ${currentColorRGB}`
            : `none`,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="relative w-120 h-120 bg-linear-to-br from-purple-600 to-pink-600 rounded-16 flex items-center justify-center "
    >
      {isLoading && (
        <div className="absolute inset-0 rounded-16 bg-black/60 backdrop-blur-[2px] z-10 animate-pulse" />
      )}
      <motion.div
        animate={{
          rotate: isPlaying ? 360 : 0,
          scale: isLoading ? 0.9 : isPlaying ? 1 + kickIntensity * 0.3 : 0.95,
        }}
        transition={{
          rotate: {
            repeat: Infinity,

            ease: "linear",
            duration: isPlaying ? 20 : 0,
          },
          scale: {
            type: "spring",
            stiffness: 1000,
            damping: 15,
          },
        }}
      >
        <Image src="/AlbumArt.png" alt="Album" width={48} height={48} />
      </motion.div>
    </motion.div>
  );
};
