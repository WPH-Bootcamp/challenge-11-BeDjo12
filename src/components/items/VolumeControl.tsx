import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const VolumeControl = memo(
  ({ volume, toggleMute, setLastVolume, setVolume }: any) => {
    return (
      <div className="flex items-center gap-8 group/volume w-full">
        <div
          className="w-16 h-16 flex items-center justify-center cursor-pointer"
          onClick={toggleMute}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={volume === 0 ? "mute" : "high"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileTap={{ scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {volume === 0 ? (
                <VolumeX className="w-16 h-16 text-neutral-400 group-hover/volume:text-purple-200 transition-colors duration-200" />
              ) : (
                <Volume2 className="w-16 h-16 text-neutral-400 group-hover/volume:text-purple-200 transition-colors duration-200" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex h-4 w-full bg-neutral-800 rounded-full">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVal = parseFloat(e.target.value);
              setVolume(newVal);
              if (newVal > 0) setLastVolume(newVal);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          <motion.div
            className="absolute top-0 left-0 h-full bg-neutral-500 group-hover/volume:bg-purple-200 rounded-full z-10 transition-colors duration-200"
            style={{ width: `${volume * 100}%` }}
            animate={{ width: `${volume * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    );
  },
);
