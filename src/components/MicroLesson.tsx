import React, { useMemo, useState } from 'react';
import ScenarioPlayer, { type ScenarioNode } from './ScenarioPlayer';
import scenarios from '../data/scenarios.json';

type ConceptNode = {
  id: string;
  type: 'concept';
  label: string;
  icon: string;
  what: string;
  does: string;
  usedFor: string;
  found: string;
};

type LessonNode = ConceptNode | ScenarioNode;
type MasteryEntry = { exposureCount: number; lastSeenAt: number };

const CONCEPTS: ConceptNode[] = [
  { id: 'apple', type: 'concept', label: 'Apple', icon: '🍎', what: 'An apple is a fruit.', does: 'It grows on trees.', usedFor: 'We eat apples as food.', found: 'Apples are found at home, school, or the market.' },
  { id: 'dog', type: 'concept', label: 'Dog', icon: '🐕', what: 'A dog is an animal.', does: 'A dog can bark and run.', usedFor: 'Dogs can be pets and helpers.', found: 'Dogs can be found at home or outside.' },
  { id: 'cup', type: 'concept', label: 'Cup', icon: '🥤', what: 'A cup is a container.', does: 'It holds a drink.', usedFor: 'We use a cup to drink water or juice.', found: 'Cups are found in kitchens and classrooms.' },
  { id: 'mother', type: 'concept', label: 'Mother', icon: '👩🏾', what: 'A mother is a caregiver.', does: 'She can care, help, and teach.', usedFor: 'We can ask mother for help or comfort.', found: 'Mother can be at home, work, or with family.' },
  { id: 'happy', type: 'concept', label: 'Happy', icon: '😊', what: 'Happy is a feeling.', does: 'It can make us smile or laugh.', usedFor: 'We say happy to share a good feeling.', found: 'Happy can happen during play, music, or family time.' },
  { id: 'run', type: 'concept', label: 'Run', icon: '🏃🏾', what: 'Run is an action.', does: 'Running moves the body fast.', usedFor: 'We run when playing or exercising.', found: 'Running can happen outside, at school, or on a field.' },
  { id: 'house', type: 'concept', label: 'House', icon: '🏠', what: 'A house is a building.', does: 'It gives people shelter.', usedFor: 'We use a house to rest, eat, and be with family.', found: 'Houses are found in villages, towns, and cities.' },
  { id: 'ball', type: 'concept', label: 'Ball', icon: '⚽', what: 'A ball is a round toy or sports object.', does: 'It can roll, bounce, or be kicked.', usedFor: 'We use a ball for games and exercise.', found: 'Balls are found at home, school, or the playground.' }
];

const BEAT_TEMPLATES: Array<keyof Pick<ConceptNode, 'what' | 'does' | 'usedFor' | 'found'>> = ['what', 'does', 'usedFor', 'found'];
const BEAT_LABELS = ['what', 'does', 'used for', 'found'];
const INTERVALS_MS = [60 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000];
const DAY_MS = 24 * 60 * 60 * 1000;

const SCENARIOS = scenarios as ScenarioNode[];
const LESSON_NODES: LessonNode[] = [...CONCEPTS, ...SCENARIOS];

function getDueAt(node: LessonNode, mastery: Record<string, MasteryEntry>) {
  const entry = mastery[node.id];
  if (!entry) return 0;
  const interval = INTERVALS_MS[Math.min(entry.exposureCount - 1, INTERVALS_MS.length - 1)] || INTERVALS_MS[0];
  return entry.lastSeenAt + interval;
}

export default function MicroLesson({
  language,
  initialFilter
}: {
  language: 'en' | 'swa';
  initialFilter?: 'scenario';
}) {
  // When initialFilter="scenario" (the /autism-world entry point), show
  // only the video/scenario nodes, not the 8 concept vocabulary cards —
  // this is what makes /autism-world a distinct, scoped view rather than
  // a duplicate of the full /toolkit/micro-lesson lesson list.
  const nodes = useMemo(
    () => (initialFilter === 'scenario' ? SCENARIOS : LESSON_NODES),
    [initialFilter]
  );

  const [mastery, setMastery] = useState<Record<string, MasteryEntry>>({});
  const [simulatedNow, setSimulatedNow] = useState(() => Date.now());
  const [activeNode, setActiveNode] = useState<LessonNode>(() => nodes[0]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('Tap start to begin the next micro-lesson.');

  // Demo-only controls (clock skip, mastery reset) are hidden from the
  // default learner view and only shown when explicitly requested via
  // ?demo=true, so a child can't tap into a mastery reset mid-session.
  const isDemoMode = useMemo(
    () => new URLSearchParams(window.location.search).get('demo') === 'true',
    []
  );

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => getDueAt(a, mastery) - getDueAt(b, mastery));
  }, [nodes, mastery]);

  const pickNextLesson = () => {
    const due = sortedNodes.find(node => getDueAt(node, mastery) <= simulatedNow);
    return due || sortedNodes[0];
  };

  const startLesson = (node = pickNextLesson()) => {
    setActiveNode(node);
    setBeatIndex(0);
    setIsPlaying(node.type === 'concept');
    setMessage(node.type === 'scenario' ? 'Scenario ready. Press start inside the player.' : 'Concept lesson started.');
  };

  const finishLesson = (node: LessonNode = activeNode) => {
    setMastery(prev => {
      const current = prev[node.id] || { exposureCount: 0, lastSeenAt: 0 };
      return {
        ...prev,
        [node.id]: {
          exposureCount: current.exposureCount + 1,
          lastSeenAt: simulatedNow
        }
      };
    });
    setIsPlaying(false);
    setMessage(`${node.type === 'scenario' ? 'Scenario' : 'Concept'} complete. Mastery updated for ${node.id}.`);
  };

  const activeMastery = mastery[activeNode.id];
  const activeDueAt = getDueAt(activeNode, mastery);

  const advanceConceptBeat = () => {
    if (activeNode.type !== 'concept') return;
    if (beatIndex >= BEAT_TEMPLATES.length - 1) {
      finishLesson(activeNode);
      return;
    }
    setBeatIndex(prev => prev + 1);
  };

  const activeConceptBeat = activeNode.type === 'concept' ? BEAT_TEMPLATES[beatIndex] : null;

  return (
    <section className="w-full bg-[#FFF8EE]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C77700]">Micro-Lesson Demo Slice</span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-[#2D3748]">{language === 'en' ? 'Learning Path' : 'Njia ya Kujifunza'}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">Concept beats and Autism World scenarios share one session mastery and spaced repetition scheduler.</p>
        </div>
        {isDemoMode && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSimulatedNow(now => now + DAY_MS)} className="rounded-full bg-[#2D3748] px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Skip sim. clock +1 day</button>
            <button onClick={() => { setMastery({}); setMessage('Demo mastery reset for this session.'); }} className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-[#2D3748] border border-[#C77700]/20">Reset mastery</button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[28px] border border-[#C77700]/10 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-[#2F6B4F]">Choose lesson node</h3>
          <div className="space-y-2">
            {nodes.map(node => (
              <button key={node.id} onClick={() => startLesson(node)} className={`w-full rounded-2xl border px-3 py-2 text-left text-xs font-bold transition ${activeNode.id === node.id ? 'border-[#C77700] bg-[#C77700]/10' : 'border-gray-100 hover:border-[#C77700]/40'}`}>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400">{node.type}</span>
                {node.type === 'concept' ? `${node.icon} ${node.label}` : `${node.setting}: ${node.communication_goal}`}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-[#C77700]/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#C77700]">Active: {activeNode.type}</p>
                <h3 className="font-serif text-2xl font-bold text-[#2D3748]">{activeNode.type === 'concept' ? activeNode.label : activeNode.id}</h3>
              </div>
              <button onClick={() => startLesson()} className="rounded-full bg-[#E89B2E] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#2D3748]">Start next due</button>
              <button onClick={() => startLesson(SCENARIOS[0])} className="rounded-full bg-[#2F6B4F] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Try Autism World</button>
            </div>
            <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
              <p className="rounded-2xl bg-[#FFF8EE] p-3"><strong>Exposures:</strong> {activeMastery?.exposureCount || 0}</p>
              <p className="rounded-2xl bg-[#FFF8EE] p-3"><strong>Sim clock:</strong> {new Date(simulatedNow).toLocaleString()}</p>
              <p className="rounded-2xl bg-[#FFF8EE] p-3"><strong>Due:</strong> {activeDueAt <= simulatedNow ? 'now' : new Date(activeDueAt).toLocaleString()}</p>
            </div>
            <p className="mt-3 text-sm font-bold text-[#2F6B4F]" role="status">{message}</p>
          </div>

          {activeNode.type === 'concept' ? (
            <section className="rounded-[28px] border border-[#C77700]/10 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#C77700]/10 text-6xl">{activeNode.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C77700]">Beat {beatIndex + 1}: {BEAT_LABELS[beatIndex]}</p>
              <h3 className="mt-2 font-serif text-4xl font-black text-[#2D3748]">{activeNode.label}</h3>
              <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-gray-600">{activeConceptBeat ? activeNode[activeConceptBeat] : ''}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setIsPlaying(true)} className="rounded-full bg-[#2F6B4F] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Tap to start</button>
                <button onClick={advanceConceptBeat} disabled={!isPlaying} className="rounded-full bg-[#E89B2E] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#2D3748] disabled:opacity-40">Next beat</button>
              </div>
            </section>
          ) : (
            <ScenarioPlayer
              scenario={activeNode}
              onCorrect={() => setMessage(`Correct response for ${activeNode.id}. Complete the scenario to update mastery.`)}
              onIncorrect={() => setMessage(`Retrying ${activeNode.id}. Mastery is unchanged until completion.`)}
              onCompleted={() => finishLesson(activeNode)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
