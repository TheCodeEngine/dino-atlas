import { AudioPlayer } from "@dino-atlas/ui";
import { useTtsContext } from "./TtsProvider";

/**
 * AudioPlayer that uses the TTS API for voiceover.
 * Drop-in replacement — same props as AudioPlayer.
 */
export function TtsAudioPlayer({ text, compact, duration: durationHint }: {
  text: string;
  compact?: boolean;
  duration?: number;
}) {
  const tts = useTtsContext();

  if (!tts) {
    // No TTS context = demo mode (Storybook)
    return <AudioPlayer text={text} compact={compact} duration={durationHint} />;
  }

  const isActive = tts.activeText === text;

  return (
    <AudioPlayer
      text={text}
      compact={compact}
      status={isActive ? tts.status : "idle"}
      progress={isActive ? tts.progress : 0}
      currentTime={isActive ? tts.currentTime : 0}
      duration={isActive ? tts.duration : durationHint}
      onPlay={() => tts.speak(text)}
      onPause={() => tts.stop()}
    />
  );
}
