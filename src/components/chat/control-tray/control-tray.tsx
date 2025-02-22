'use client';

import AudioPulse from '@/components/chat/audio-pulse/audio-pulse';
import { cn } from '@/lib/utils';
import { useLiveAPIContext } from '@contexts/LiveAPIContext';
import { UseMediaStreamResult } from '@hooks/use-media-stream-mux';
import { useScreenCapture } from '@hooks/use-screen-capture';
import { useWebcam } from '@hooks/use-webcam';
import { AudioRecorder } from '@lib/audio-recorder';
import { ReactNode, RefObject, memo, useEffect, useRef, useState, useCallback } from 'react';
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineScreenShare } from "react-icons/md";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { VscDebugStart, VscDebugPause } from "react-icons/vsc";
import { Button } from "@/components/ui/button";

export type ControlTrayProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
};

type MediaStreamButtonProps = {
  isStreaming: boolean;
  onIcon: ReactNode;
  offIcon: ReactNode;
  start: () => Promise<any>;
  stop: () => any;
  disabled?: boolean;
};

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(
  ({ isStreaming, onIcon, offIcon, start, stop, disabled }: MediaStreamButtonProps) =>
    isStreaming ? (
      <Button
        variant="secondary"
        size="icon"
        className="w-12 h-12"
        onClick={stop}
        disabled={disabled}
      >
        {onIcon}
      </Button>
    ) : (
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12"
          onClick={start}
          disabled={disabled}
        >
          {offIcon}
        </Button>
    )
);

function ControlTray({
  videoRef,
  children,
  onVideoStreamChange = () => {},
  supportsVideo,
}: ControlTrayProps) {
  const videoStreams = [useWebcam(), useScreenCapture()];
  const [activeVideoStream, setActiveVideoStream] =
    useState<MediaStream | null>(null);
  const [webcam, screenCapture] = videoStreams;
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  // Move visual effect handling to useEffect
  useEffect(() => {
    if (volume > 0 || connected) {
      document.documentElement.style.setProperty(
        '--volume',
        `${Math.max(5, Math.min(volume * 200, 8))}px`
      );
    }
  }, [volume, connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData).on('volume', setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData).off('volume', setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  // Add proper type checking for videoRef
  const handleVideoFrame = useCallback(() => {
    const video = videoRef?.current;
    const canvas = renderCanvasRef.current;
    if (!video || !canvas) return;
    // ...existing video frame logic...
  }, [videoRef, client, connected]);

  useEffect(() => {
    if (!videoRef?.current || !activeVideoStream) return;
    videoRef.current.srcObject = activeVideoStream;
    let frameId = -1;
    let timeoutId = -1;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas) {
        return;
      }

      const ctx = canvas.getContext('2d')!;
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;

      if (videoRef.current && canvas.width + canvas.height > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 1.0);
        const data = base64.slice(base64.indexOf(',') + 1, Infinity);
        client.sendRealtimeInput([{ mimeType: 'image/jpeg', data }]);
      }

      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5);
      }
    }

    if (connected && activeVideoStream) {
      frameId = requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [connected, activeVideoStream, client, videoRef, handleVideoFrame]);

  //handler for swapping from one video-stream to the next
  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    if (next) {
      const mediaStream = await next.start();
      setActiveVideoStream(mediaStream);
      onVideoStreamChange(mediaStream);
    } else {
      setActiveVideoStream(null);
      onVideoStreamChange(null);
    }

    videoStreams.filter((msr) => msr !== next).forEach((msr) => msr.stop());
  };

  return (
    <div className="flex items-center gap-4">
      <canvas className="hidden" ref={renderCanvasRef} />

      <div className="flex-1 flex items-center gap-2 p-2 bg-muted/20 backdrop-blur rounded-2xl">
        <Button
          variant={!muted && connected ? "destructive" : "secondary"}
          size="icon"
          className="w-12 h-12"
          disabled={!connected}
          onClick={() => setMuted(!muted)}
        >
          {!muted && connected ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
        </Button>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted/20">
          <AudioPulse volume={volume} active={connected} hover={false} />
        </div>

        {supportsVideo && (
          <>
            <MediaStreamButton
              isStreaming={screenCapture.isStreaming}
              start={changeStreams(screenCapture)}
              stop={changeStreams()}
              onIcon={<MdOutlineScreenShare size={20} />}
              offIcon={<MdOutlineScreenShare size={20} />}
              disabled={!connected}
            />
            <MediaStreamButton
              isStreaming={webcam.isStreaming}
              start={changeStreams(webcam)}
              stop={changeStreams()}
              onIcon={<IoImageOutline size={20} />}
              offIcon={<IoImageOutline size={20} />}
              disabled={!connected}
            />
          </>
        )}
        {children}
      </div>

      <Button
        ref={connectButtonRef}
        variant={connected ? "default" : "secondary"}
        size="icon"
        className="w-12 h-12"
        onClick={connected ? disconnect : connect}
      >
        {connected ? <VscDebugPause size={20} /> : <VscDebugStart size={20} />}
      </Button>
    </div>
  );
}

export default memo(ControlTray);
