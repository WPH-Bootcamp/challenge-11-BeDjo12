"use client";
import { MusicPlayer } from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center bg-[#0A0D12] justify-center">
      <div className="max-w-500 w-full ">
        <MusicPlayer />
      </div>
    </main>
  );
}
