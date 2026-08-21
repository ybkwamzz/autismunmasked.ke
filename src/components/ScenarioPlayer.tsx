import React, { useEffect, useMemo, useRef, useState } from 'react';

export type ScenarioOption = { id: string; text: string };

export type ScenarioNode = {
  id: string;
  type: 'scenario';
  setting: 'school' | 'home';
  communication_goal: string;
  difficulty: 1 | 2 | 3;
  video_id: string;
  start_seconds: number;
  end_seconds: number;
  interaction_points: Array<{
    at_seconds: number;
    prompt: string;
    options: ScenarioOption[];
    correct_option_id: string;
  }>;
  related_scenario_ids: string[];
};

type ScenarioPlayerProps = {
  scenario: ScenarioNode;
  onCorrect: () => void;
  onIncorrect: () => void;
  onCompleted: () => void;
};

type YouTubePlayer = {
  destroy: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
  data: number;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: () => void;
      };
    }
  ) => YouTubePlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_API_SRC = 'https://www.youtube.com/iframe_api';
let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`);
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT) resolve(window.YT);
    };

    if (!existing) {
      const script = document.createElement('script');
      script.src = YOUTUBE_API_SRC;
      script.async = true;
      script.onerror = () => reject(new Error('YouTube IFrame API failed to load'));
      document.body.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export default function ScenarioPlayer({ scenario, onCorrect, onIncorrect, onCompleted }: ScenarioPlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const answeredCorrectlyRef = useRef(false);
  const completedRef = useRef(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'question' | 'unavailable' | 'completed'>('idle');
  const [activeInteraction, setActiveInteraction] = useState<ScenarioNode['interaction_points'][number] | null>(null);
  const [feedback, setFeedback] = useState('');

  const firstInteraction = useMemo(
    () => scenario.interaction_points?.[0] || null,
    [scenario]
  );
  const hasPlayableVideo = Boolean(scenario.video_id && scenario.end_seconds > scenario.start_seconds);

  useEffect(() => {
    setStatus('idle');
    setActiveInteraction(null);
    answeredCorrectlyRef.current = false;
    completedRef.current = false;
    setFeedback('');
    hasStartedRef.current = false;

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
      pollRef.current = null;
      playerRef.current = null;
    };
  }, [scenario.id]);

  const showInteraction = () => {
    if (!firstInteraction || activeInteraction || answeredCorrectlyRef.current) return;
    playerRef.current?.pauseVideo();
    setActiveInteraction(firstInteraction);
    setStatus('question');
  };

  const completeScenario = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = null;
    setStatus('completed');
    onCompleted();
  };

  const showFallback = () => {
    hasStartedRef.current = true;
    setStatus('unavailable');
  };

  const startFallbackQuestion = () => {
    hasStartedRef.current = true;
    setStatus('question');
    setActiveInteraction(firstInteraction);
  };

  const startVideo = async () => {
    if (!hasPlayableVideo) {
      showFallback();
      return;
    }

    setStatus('loading');
    try {
      const YT = await loadYouTubeApi();
      if (!hostRef.current) return;

      if (!playerRef.current) {
        playerRef.current = new YT.Player(hostRef.current, {
          videoId: scenario.video_id,
          playerVars: {
            start: scenario.start_seconds,
            end: scenario.end_seconds,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            autoplay: 0
          },
          events: {
            onReady: event => {
              hasStartedRef.current = true;
              setStatus('playing');
              event.target.seekTo(scenario.start_seconds, true);
              event.target.playVideo();
            },
            onStateChange: event => {
              if (event.data === YT.PlayerState.ENDED && answeredCorrectlyRef.current) {
                completeScenario();
              }
            },
            onError: () => showFallback()
          }
        });
      } else {
        hasStartedRef.current = true;
        setStatus('playing');
        playerRef.current.seekTo(scenario.start_seconds, true);
        playerRef.current.playVideo();
      }

      pollRef.current = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime) return;
        const current = player.getCurrentTime();
        if (firstInteraction && !answeredCorrectlyRef.current && current >= firstInteraction.at_seconds) {
          showInteraction();
        }
        if (answeredCorrectlyRef.current && current >= scenario.end_seconds) {
          completeScenario();
        }
      }, 250);
    } catch {
      showFallback();
    }
  };

  const chooseOption = (optionId: string) => {
    if (!activeInteraction) return;
    if (optionId === activeInteraction.correct_option_id) {
      setFeedback('Correct — great communication choice.');
      answeredCorrectlyRef.current = true;
      setActiveInteraction(null);
      onCorrect();
      if (!hasPlayableVideo) {
        window.setTimeout(completeScenario, 700);
      } else {
        setStatus('playing');
        playerRef.current?.playVideo();
      }
      return;
    }

    setFeedback('Try again. The video will return to the practice moment.');
    onIncorrect();
    if (hasPlayableVideo) {
      playerRef.current?.seekTo(Math.max(scenario.start_seconds, activeInteraction.at_seconds - 1), true);
      playerRef.current?.playVideo();
      setActiveInteraction(null);
      setStatus('playing');
    }
  };

  return (
    <section className="bg-white border border-[#C77700]/10 rounded-[28px] p-5 shadow-sm" aria-label="Autism World scenario player">
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#C77700]">Autism World Scenario</span>
        <h3 className="text-2xl font-bold font-serif text-[#2D3748] capitalize">{scenario.setting}: {scenario.communication_goal}</h3>
        <p className="text-xs text-gray-500">Bounded practice. Choose the clearest communication response when the question appears.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-[#2D3748] min-h-[260px] flex items-center justify-center text-white">
        {hasPlayableVideo && <div ref={hostRef} className="absolute inset-0 w-full h-full" />}

        {!hasStartedRef.current && status !== 'loading' && (
          <button onClick={startVideo} className="relative z-10 bg-[#E89B2E] text-[#2D3748] px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest">
            Start scenario
          </button>
        )}

        {status === 'loading' && <p className="relative z-10 text-sm font-bold">Loading video…</p>}

        {status === 'unavailable' && !activeInteraction && (
          <div className="relative z-10 max-w-md text-center p-6">
            <p className="text-lg font-bold">Video content unavailable</p>
            <p className="text-sm text-white/80 mt-2">This demo keeps the practice interaction available while final YouTube IDs and timestamps are added.</p>
            <button onClick={startFallbackQuestion} className="mt-4 bg-white text-[#2D3748] px-5 py-2.5 rounded-full text-xs font-black uppercase">Practice question</button>
          </div>
        )}

        {activeInteraction && (
          <div className="absolute inset-0 z-20 bg-[#2D3748]/95 flex items-center justify-center p-5">
            <div className="bg-[#FFF8EE] text-[#2D3748] rounded-3xl p-5 max-w-lg w-full shadow-xl">
              <p className="text-lg font-bold mb-4">{activeInteraction.prompt}</p>
              <div className="grid gap-3">
                {activeInteraction.options.map(option => (
                  <button key={option.id} onClick={() => chooseOption(option.id)} className="text-left bg-white hover:bg-[#E89B2E]/20 border-2 border-[#C77700]/20 rounded-2xl px-4 py-3 text-sm font-bold">
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="relative z-10 text-center p-6">
            <p className="text-2xl font-black">Scenario complete</p>
            <p className="text-sm text-white/80 mt-2">Mastery and scheduling updated.</p>
          </div>
        )}
      </div>

      {feedback && <p className="mt-3 text-sm font-bold text-[#2F6B4F]" role="status">{feedback}</p>}
    </section>
  );
}
