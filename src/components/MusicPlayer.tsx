"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Album } from "./items/Album";
import { Equalizer } from "./items/Equalizer";
import { PlayerControl } from "./items/PlayerControl";
import { VolumeControl } from "./items/VolumeControl";

const playlist = [
  {
    id: 1,
    title: "1.Break",
    artist: "Three Day Grace",
    src: "/music/Three_Days_Grace_-_Break.opus",
  },
  {
    id: 2,
    title: "2.Centuries",
    artist: "Fall Out Boy",
    src: "/music/Fall_Out_Boy_-_Centuries.opus",
  },
  {
    id: 3,
    title: "3.Seven Nation Army",
    artist: "The White Stripes",
    src: "/music/The_White_Stripes_-_Seven_Nation_Army.opus",
  },
  {
    id: 4,
    title: "4.Plug in baby",
    artist: "Muse",
    src: "/music/Muse_-_Plug_In_Baby.opus",
  },
  {
    id: 5,
    title: "5.Hash Pipe",
    artist: "Weezer",
    src: "/music/Weezer_-_Hash_Pipe.opus",
  },
  {
    id: 6,
    title: "6.Thnks fr th Mmrs",
    artist: "Fall Out Boy",
    src: "/music/Fall_Out_Boy_-_Thnks_fr_th_Mmrs.opus",
  },
];

const colors = ["#545252", "#1A1A1A"];

const bar = [
  { id: 1, freqIndex: 0 },
  { id: 2, freqIndex: 2 },
  { id: 3, freqIndex: 4 },
  { id: 4, freqIndex: 8 },
  { id: 5, freqIndex: 16 },
];

export function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [isDragging, setIsDragging] = useState(false);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext>(null);
  const analyserRef = useRef<AnalyserNode>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode>(null);
  const animationRef = useRef<number>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const lastBeatTime = useRef(0);

  //  DERIVED VALUES (Calculations)
  const currentSong = playlist[currentSongIndex];
  const remainingTime = duration - currentTime;
  const kickValue = frequencyData[bar[0].freqIndex] || 0;
  const kickIntensity = kickValue / 255;
  const isKickHit = isPlaying && kickIntensity > 0.65;
  const currentOpacity = isKickHit ? 0.5 : 0.3;
  const currentColorRGB = colors[colorIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // AUDIO & VISUALIZER
  const setupAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    analyser.minDecibels = -60;
    analyser.maxDecibels = -20;
    analyser.smoothingTimeConstant = 0.7;
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
  };

  const updateVisualizer = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    setFrequencyData(new Uint8Array(dataArray));
    const currentKick = dataArray[bar[0].freqIndex] / 255;
    const now = Date.now();
    if (currentKick > 0.7 && now - lastBeatTime.current > 300) {
      lastBeatTime.current = now;
      setColorIndex((prev) => (prev === 0 ? 1 : 0));
    }
    animationRef.current = requestAnimationFrame(updateVisualizer);
  };

  // SIDE EFFECTS
  useEffect(() => {
    if (isPlaying) {
      setupAudioContext();
      audioRef.current
        ?.play()
        .catch((err) => console.error("Playback error:", err));
      const loop = () => {
        updateVisualizer();
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else {
      audioRef.current?.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // INTERACTION HANDLERS
  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleScrub = (e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );
    const newTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const togglePlayPause = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsPlaying((prev) => !prev);
      setIsLoading(false);
    }, 500);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.5);
    }
  };

  const nextSong = (isAuto = false) => {
    if (
      isAuto &&
      !isShuffle &&
      repeatMode === "none" &&
      currentSongIndex === playlist.length - 1
    ) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setCurrentSongIndex((prev) => {
        if (isShuffle) {
          let next;
          do {
            next = Math.floor(Math.random() * playlist.length);
          } while (next === prev);
          return next;
        }
        return (prev + 1) % playlist.length;
      });
      setIsLoading(false);
    }, 500);
  };

  const prevSong = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentSongIndex(
        (prev) => (prev - 1 + playlist.length) % playlist.length,
      );
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.div
      className="w-full  bg-gray-950 flex flex-col p-16 gap-20 rounded-16 transition-colors duration-300"
      animate={{
        backgroundColor: isPlaying ? "#1A1A1A" : "#0F0F0F",
        boxShadow: isPlaying
          ? `0 0 40px 0 rgba(139, 92, 246, ${currentOpacity})`
          : `0 4px 20px 0 rgba(0, 0, 0, 0.5)`,
      }}
      transition={{
        duration: 0.15,
        ease: "easeInOut",
      }}
    >
      <div className="w-full h-142 flex flex-col justify-between">
        <div className="w-full gap-24 items-center flex">
          {/* Album */}
          <Album
            isPlaying={isPlaying}
            isLoading={isLoading}
            kickIntensity={kickIntensity}
            currentColorRGB={currentColorRGB}
          />
          <div className="flex flex-col gap-5">
            <h1 className="text-neutral-100 text-[18px]/[32px] font-semibold ">
              {currentSong.title}
            </h1>
            <p className="text-neutral-400 text-[14px]/[28px] font-normal tracking-tight ">
              {currentSong.artist}
            </p>
          </div>
        </div>
        {/* equalizer bar */}
        <Equalizer
          isPlaying={isPlaying}
          isLoading={isLoading}
          frequencyData={frequencyData}
          bar={bar}
        />
      </div>
      {/* progress bar slider */}
      <div
        ref={progressRef}
        className="w-full h-8 relative bg-neutral-800 rounded-full overflow-hidden"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleScrub(e);

          const onMouseMove = (moveEvent: MouseEvent) => {
            handleScrub(moveEvent);
          };

          const onMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };

          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      >
        <motion.div
          className="h-full bg-purple-200"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: isDragging ? 0 : 0.1 }}
        />
      </div>

      {/* Timer */}
      <div className="flex justify-between text-neutral-500 text-[12px] tracking-tight">
        <span>{formatTime(currentTime)}</span>

        <span>{formatTime(remainingTime > 0 ? remainingTime : 0)}</span>
      </div>
      {/* buttom */}
      <PlayerControl
        isPlaying={isPlaying}
        isLoading={isLoading}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        togglePlayPause={togglePlayPause}
        prevSong={prevSong}
        nextSong={nextSong}
        setIsShuffle={setIsShuffle}
        setRepeatMode={setRepeatMode}
        toggleMute={toggleMute}
      />
      {/* Volume Slider Container */}
      <VolumeControl
        volume={volume}
        setVolume={setVolume}
        setLastVolume={setLastVolume}
        toggleMute={toggleMute}
      />
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={() => {
          if (repeatMode === "one") {
            audioRef.current?.play();
          } else {
            nextSong(true);
          }
        }}
        hidden
      />
    </motion.div>
  );
}
