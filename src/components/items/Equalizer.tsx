import { motion } from "framer-motion";

interface EqualizerProps {
  isPlaying: boolean;
  isLoading: boolean;
  frequencyData: Uint8Array;
  bar: { id: number; freqIndex: number }[];
}

export const Equalizer = ({
  isPlaying,
  isLoading,
  frequencyData,
  bar,
}: EqualizerProps) => {
  return (
    <div className="relative flex items-center w-full h-6">
      <div className="w-56 absolute left-144 bottom-0 flex gap-4 items-end overflow-hidden h-32">
        {bar.map((item, index) => (
          <motion.div
            key={item.id}
            className="w-8 bg-purple-200"
            animate={{
              height: isLoading
                ? "50%"
                : isPlaying
                  ? `${4 + ((frequencyData[item.freqIndex] || 0) / 255) * 38}px`
                  : "20%",
              opacity: isLoading ? 0.5 : 1,
            }}
            transition={{
              height: isPlaying
                ? { type: "spring", stiffness: 900, damping: 20 }
                : { duration: 0.3 },
              opacity: { delay: index * 0.1 },
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
