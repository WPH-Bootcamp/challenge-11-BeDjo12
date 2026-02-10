import { motion } from "framer-motion";
import { memo } from "react";
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Repeat1,
} from "lucide-react";

export const PlayerControl = memo(
  ({
    isPlaying,
    isLoading,
    isShuffle,
    repeatMode,
    togglePlayPause,
    prevSong,
    nextSong,
    setIsShuffle,
    setRepeatMode,
  }: any) => {
    return (
      <div className="flex gap-16 justify-center items-center">
        {/* shuffle */}
        <motion.div
          onClick={() => !isLoading && setIsShuffle(!isShuffle)}
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          whileHover={{ color: "white", scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            color: isShuffle ? "#8B5CF6" : "#D5D7DA",
            scale: isShuffle ? 1.05 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
          }}
        >
          <div className="relative flex flex-col items-center justify-center">
            <Shuffle
              className="w-20 h-20 transition-colors duration-200"
              style={{ strokeWidth: isShuffle ? 2.5 : 2 }}
            />
          </div>
        </motion.div>
        {/*skip back */}
        <motion.div
          onClick={prevSong}
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          initial={{ color: "#D5D7DA" }}
          animate={{ color: "#D5D7DA" }}
          whileHover={{ color: "white", scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
          }}
        >
          <SkipBack className="w-20 h-20" />
        </motion.div>
        {/* play/pause */}
        <motion.div
          onClick={() => {
            if (isLoading) return;
            togglePlayPause();
          }}
          className="w-56 h-56 rounded-full flex items-center justify-center cursor-pointer"
          animate={{
            backgroundColor: isLoading
              ? "#717680"
              : isPlaying
                ? "#8B5CF6"
                : "#7C3AED",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{
              opacity: isLoading ? 0.5 : 1,
              rotate: isPlaying ? 0 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key={isPlaying ? "pause" : "play"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? (
                <Pause className="w-24 h-24 text-white" />
              ) : (
                <Play className="w-24 h-24 text-white" />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
        {/* skip next */}
        <motion.div
          onClick={() => nextSong(false)}
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          initial={{ color: "#D5D7DA" }}
          animate={{ color: "#D5D7DA" }}
          whileHover={{ color: "white", scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
          }}
        >
          <SkipForward className="w-20 h-20" />
        </motion.div>
        {/* repeat */}
        <motion.div
          onClick={() => {
            if (repeatMode === "none") setRepeatMode("all");
            else if (repeatMode === "all") setRepeatMode("one");
            else setRepeatMode("none");
          }}
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer bg-transparent"
          whileHover={{ color: "white", scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            color: repeatMode !== "none" ? "#8B5CF6" : "#D5D7DA",
            scale: repeatMode !== "none" ? 1.05 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
        >
          <div className="relative flex items-center justify-center">
            {repeatMode === "one" ? (
              <Repeat1 className="w-22 h-22 transition-all duration-200" />
            ) : (
              <Repeat
                className={`transition-all duration-200 ${repeatMode === "all" ? "w-22 h-22" : "w-20 h-20"}`}
              />
            )}
          </div>
        </motion.div>
      </div>
    );
  },
);
