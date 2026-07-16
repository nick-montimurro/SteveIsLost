
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Country, DialogueResultType, GameState, NPC, DialogueOption, PlayerStats, VocabularyItem } from './types';
import { INITIAL_STATS, COUNTRY_LANGUAGES, COUNTRY_FLAGS, COUNTRY_COLORS, JOURNEY_STAGES, LOADING_MESSAGES } from './constants';
import { GAME_DATA, COUNTRY_VOCAB_POOLS } from './data/gameData';
import { resolveSprite, resolveLocationBg } from './data/spriteMapping';
import { audioService } from './services/audioService';
import { PixelButton, StatusBar, TypewriterText, DialogueBox, SpriteDisplay, JourneyProgress, FeedbackFlash, ScreenTransition } from './components/RetroUI';

const TOTAL_STAGES = 6; // 6 NPCs per country
const ROUNDS_PER_NPC = 3; // 3 dialogue depth

/**
 * Main game component. Manages all game state and renders the appropriate screen.
 */
const App: React.FC = () => {
  // ── GAME STATE ──
  const [stats, setStats] = useState<PlayerStats>({ ...INITIAL_STATS });
  const [gameState, setGameState] = useState<GameState>({
    currentCountry: null,
    journeyStage: 0,
    currentRound: 0,
    isGameOver: false,
    gameEnding: null,
    currentNpc: null,
    currentPrompt: null,
    locationImageUrl: undefined,
    status: 'menu',
    babelFishUsed: false,
    translatedOptionIndex: null,
    isTransitioning: false,
    feedbackType: null,
  });

  const [loadingMsg, setLoadingMsg] = useState('');
  const [showEnding, setShowEnding] = useState(false);
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [pendingFollowUp, setPendingFollowUp] = useState<DialogueOption['followUp'] | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [countryCompleted, setCountryCompleted] = useState<Set<Country>>(new Set());

  // ── GAME LOGIC ──
  const applyStatEffects = useCallback((type: DialogueResultType) => {
    setStats(prev => {
      const updated = { ...prev };
      if (type === DialogueResultType.POSITIVE) {
        updated.xp += 5;
      } else if (type === DialogueResultType.NEUTRAL) {
        updated.xp += 2;
      } else if (type === DialogueResultType.OFFENSIVE) {
        updated.hp = Math.max(0, updated.hp - 2);
        updated.insanity = Math.min(updated.maxInsanity, updated.insanity + 1);
        updated.xp += 1;
      }
      // Natural drain per interaction
      updated.hunger = Math.max(0, updated.hunger - 1);
      updated.thirst = Math.max(0, updated.thirst - 1);

      // Level up check
      if (updated.xp >= updated.maxXp) {
        updated.xp = 0;
        updated.level += 1;
        updated.maxXp = Math.floor(updated.maxXp * 1.4);
        updated.maxHp += 2;
        updated.hp = Math.min(updated.hp + 5, updated.maxHp);
        updated.hunger = Math.min(updated.hunger + 3, updated.maxHunger);
        updated.thirst = Math.min(updated.thirst + 3, updated.maxThirst);
        audioService.playLevelUp();
      }
      return updated;
    });
  }, []);

  const addRandomVocab = useCallback((country: Country) => {
    const pool = COUNTRY_VOCAB_POOLS[country];
    if (!pool) return;
    const unlearned = pool.filter(
      v => !stats.unlockedVocab.find(u => u.word === v.word)
    );
    if (unlearned.length > 0) {
      const word = unlearned[Math.floor(Math.random() * unlearned.length)];
      setStats(prev => ({
        ...prev,
        unlockedVocab: [...prev.unlockedVocab, word],
      }));
    }
  }, [stats.unlockedVocab]);

  const checkGameOver = useCallback((): boolean => {
    if (stats.hp <= 0) {
      setGameState(prev => ({ ...prev, isGameOver: true, gameEnding: 'dead', status: 'ending' }));
      audioService.playGameOver();
      return true;
    }
    if (stats.insanity >= stats.maxInsanity) {
      setGameState(prev => ({ ...prev, isGameOver: true, gameEnding: 'dead', status: 'ending' }));
      audioService.playGameOver();
      return true;
    }
    return false;
  }, [stats.hp, stats.insanity, stats.maxInsanity]);

  // ── START GAME WITH COUNTRY ──
  const startCountry = useCallback((country: Country) => {
    audioService.playClick();
    const npcs = GAME_DATA[country];
    if (!npcs || npcs.length === 0) return;

    setGameState(prev => ({
      ...prev,
      isTransitioning: true,
    }));

    // Loading screen
    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    loadingIntervalRef.current = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 2500);

    setTimeout(() => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);

      const npc = npcs[0];
      setGameState({
        currentCountry: country,
        journeyStage: 0,
        currentRound: 0,
        isGameOver: false,
        gameEnding: null,
        currentNpc: npc,
        currentPrompt: {
          npcLineLocal: npc.introLocal,
          npcLineEnglish: npc.introEnglish,
          options: npc.initialOptions,
        },
        locationImageUrl: resolveLocationBg(country, 0),
        status: 'playing',
        babelFishUsed: false,
        translatedOptionIndex: null,
        isTransitioning: false,
        feedbackType: null,
      });

      audioService.stopBgm();
      audioService.speak(npc.introLocal, COUNTRY_LANGUAGES[country]);
    }, 2500);
  }, []);

  // ── HANDLE DIALOGUE CHOICE ──
  const handleChoice = useCallback((option: DialogueOption) => {
    if (gameState.isGameOver) return;
    if (!gameState.currentCountry) return;

    audioService.playClick();
    const country = gameState.currentCountry;

    // Apply stat effects
    applyStatEffects(option.type);
    addRandomVocab(country);

    // Set feedback
    setGameState(prev => ({ ...prev, feedbackType: option.type }));

    const feedbackTexts = {
      [DialogueResultType.POSITIVE]: '+5 XP  ✦ Correct response!',
      [DialogueResultType.NEUTRAL]: '+2 XP  ◆ Could be better.',
      [DialogueResultType.OFFENSIVE]: '-2 HP  +1 INSANITY  ✖ Offensive!',
    };
    setFeedbackMessage(feedbackTexts[option.type]);

    // Check for game over after a short delay
    setTimeout(() => {
      if (checkGameOver()) return;

      // If this option has a followUp, show the follow-up dialogue
      if (option.followUp) {
        const fu = option.followUp;
        setPendingFollowUp(fu);

        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1,
          currentPrompt: {
            npcLineLocal: fu.npcResponseLocal,
            npcLineEnglish: fu.npcResponseEnglish,
            options: fu.options,
          },
          babelFishUsed: false,
          translatedOptionIndex: null,
          feedbackType: null,
        }));

        audioService.speak(fu.npcResponseLocal, COUNTRY_LANGUAGES[country]);
      } else {
        // No follow-up — this interaction is over, advance to next NPC/stage
        advanceToNextStage();
      }
    }, 600);
  }, [gameState, applyStatEffects, addRandomVocab, checkGameOver]);

  // ── ADVANCE TO NEXT STAGE ──
  const advanceToNextStage = useCallback(() => {
    if (!gameState.currentCountry) return;
    const country = gameState.currentCountry;
    const npcs = GAME_DATA[country];
    const nextStage = gameState.journeyStage + 1;

    setGameState(prev => ({
      ...prev,
      isTransitioning: true,
      feedbackType: null,
    }));

    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

    setTimeout(() => {
      if (nextStage >= TOTAL_STAGES || nextStage >= npcs.length) {
        // Country complete! Check if this is the last country
        const completedSet = new Set(countryCompleted);
        completedSet.add(country);
        setCountryCompleted(completedSet);

        const allCountries = Object.values(Country);
        const allDone = allCountries.every(c => completedSet.has(c));

        if (allDone) {
          // GAME WON!
          setGameState(prev => ({
            ...prev,
            isGameOver: true,
            gameEnding: 'home',
            status: 'ending',
            isTransitioning: false,
          }));
          audioService.playVictory();
        } else {
          // Back to overworld
          setGameState(prev => ({
            ...prev,
            status: 'overworld',
            currentNpc: null,
            currentPrompt: null,
            isTransitioning: false,
            currentCountry: null,
            journeyStage: 0,
          }));
        }
      } else {
        // Next NPC in the journey
        const npc = npcs[nextStage];
        setGameState(prev => ({
          ...prev,
          journeyStage: nextStage,
          currentRound: 0,
          currentNpc: npc,
          currentPrompt: {
            npcLineLocal: npc.introLocal,
            npcLineEnglish: npc.introEnglish,
            options: npc.initialOptions,
          },
          locationImageUrl: resolveLocationBg(country, nextStage),
          babelFishUsed: false,
          translatedOptionIndex: null,
          isTransitioning: false,
          feedbackType: null,
        }));

        audioService.speak(npc.introLocal, COUNTRY_LANGUAGES[country]);
      }
    }, 1200);
  }, [gameState, countryCompleted]);

  // ── BABEL FISH (Translate one option) ──
  const useBabelFish = useCallback((optionIndex: number) => {
    if (gameState.babelFishUsed) return;
    audioService.playPowerUp();
    setGameState(prev => ({
      ...prev,
      babelFishUsed: true,
      translatedOptionIndex: optionIndex,
    }));
  }, [gameState.babelFishUsed]);

  // ── RESTART ──
  const restartGame = useCallback(() => {
    setStats({ ...INITIAL_STATS });
    setCountryCompleted(new Set());
    setGameState({
      currentCountry: null,
      journeyStage: 0,
      currentRound: 0,
      isGameOver: false,
      gameEnding: null,
      currentNpc: null,
      currentPrompt: null,
      locationImageUrl: undefined,
      status: 'menu',
      babelFishUsed: false,
      translatedOptionIndex: null,
      isTransitioning: false,
      feedbackType: null,
    });
    setPendingFollowUp(null);
    setFeedbackMessage('');
  }, []);

  // ── CLEANUP ──
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, []);

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-2 md:p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <ScreenTransition active={gameState.isTransitioning} />

      {/* TITLE SCREEN */}
      {gameState.status === 'menu' && <TitleScreen onStart={() => setGameState(prev => ({ ...prev, status: 'overworld' }))} />}

      {/* OVERWORLD / COUNTRY SELECT */}
      {gameState.status === 'overworld' && (
        <OverworldScreen
          stats={stats}
          onSelectCountry={startCountry}
          completedCountries={countryCompleted}
        />
      )}

      {/* LOADING / TRANSITION */}
      {gameState.isTransitioning && (
        <div className="fixed inset-0 z-[9990] bg-black flex flex-col items-center justify-center">
          <div className="animate-idleBob text-4xl mb-8">✈️</div>
          <p className="text-[10px] text-blue-400 uppercase tracking-wider animate-pulse text-center px-4">{loadingMsg}</p>
        </div>
      )}

      {/* GAMEPLAY */}
      {gameState.status === 'playing' && gameState.currentNpc && gameState.currentPrompt && gameState.currentCountry && (
        <GameplayScreen
          gameState={gameState}
          stats={stats}
          onChoice={handleChoice}
          onBabelFish={useBabelFish}
          feedbackMessage={feedbackMessage}
        />
      )}

      {/* ENDING */}
      {gameState.status === 'ending' && (
        <EndingScreen
          ending={gameState.gameEnding}
          stats={stats}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

// ============================================================
// SUB-SCREENS
// ============================================================

const TitleScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-6 text-4xl md:text-6xl animate-idleBob">✈️</div>
      <h1 className="text-xl md:text-3xl mb-4 animate-titleFlicker tracking-tight">
        STEVE IS LOST
      </h1>
      {showSubtitle && (
        <div className="animate-fadeIn">
          <p className="text-[9px] md:text-xs text-blue-400 mb-8 tracking-wider">EURO-TRIP SURVIVAL</p>
          <div className="text-[7px] text-gray-600 mb-8 max-w-md leading-relaxed px-4">
            Steve from Idaho accidentally boarded the wrong plane. Now he's stranded in Europe with no money, no phone, and zero language skills. Help him navigate 6 countries and GET HOME.
          </div>
          <PixelButton onClick={onStart} variant="primary" className="px-8 py-3">
            START JOURNEY
          </PixelButton>
          <div className="mt-6 text-[6px] text-gray-700 animate-pulse">PRESS START TO BEGIN</div>
        </div>
      )}
    </div>
  );
};

const OverworldScreen: React.FC<{
  stats: PlayerStats;
  onSelectCountry: (country: Country) => void;
  completedCountries: Set<Country>;
}> = ({ stats, onSelectCountry, completedCountries }) => {
  const countries = Object.values(Country);

  return (
    <div className="w-full max-w-3xl animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-sm md:text-base mb-2 tracking-tight">SELECT DESTINATION</h2>
        <p className="text-[7px] text-gray-500">Choose where Steve goes next</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 px-2">
        <StatusBar label="HP" value={stats.hp} max={stats.maxHp} color="bg-red-600" />
        <StatusBar label="Hunger" value={stats.hunger} max={stats.maxHunger} color="bg-yellow-600" />
        <StatusBar label="Thirst" value={stats.thirst} max={stats.maxThirst} color="bg-blue-600" />
        <StatusBar label="Insanity" value={stats.insanity} max={stats.maxInsanity} color="bg-purple-600" />
      </div>

      {/* Level/XP */}
      <div className="text-center mb-6 text-[8px] text-gray-400">
        LVL {stats.level} <span className="text-blue-400 mx-2">|</span> XP {stats.xp}/{stats.maxXp}
        <span className="text-blue-400 mx-2">|</span> VOCAB: {stats.unlockedVocab.length} words
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-2">
        {countries.map(country => {
          const completed = completedCountries.has(country);
          const colors = COUNTRY_COLORS[country];
          return (
            <button
              key={country}
              onClick={() => !completed && onSelectCountry(country)}
              disabled={completed}
              className={`
                p-4 border-2 text-left transition-all duration-200 cursor-pointer
                ${completed
                  ? 'border-green-800 bg-green-950/30 opacity-60'
                  : 'border-gray-700 bg-gray-900/80 hover:border-blue-500 hover:bg-gray-800/80 hover:shadow-lg'
                }
              `}
              style={!completed ? { ['--glow' as string]: colors.glow } : {}}
            >
              <div className="text-lg mb-2">{COUNTRY_FLAGS[country]}</div>
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: completed ? '#22c55e' : colors.primary }}>
                {country}
              </div>
              <div className="text-[7px] text-gray-500">{COUNTRY_LANGUAGES[country]}</div>
              {completed && (
                <div className="text-[7px] text-green-500 mt-2">✓ COMPLETED</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Vocab unlock display */}
      {stats.unlockedVocab.length > 0 && (
        <div className="mt-6 px-2">
          <p className="text-[7px] text-gray-600 mb-2 uppercase">Learned Vocabulary:</p>
          <div className="flex flex-wrap gap-1">
            {stats.unlockedVocab.slice(-12).map((v, i) => (
              <span key={i} className="text-[6px] bg-gray-900 border border-gray-800 px-2 py-1 text-blue-400">
                {v.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GameplayScreen: React.FC<{
  gameState: GameState;
  stats: PlayerStats;
  onChoice: (option: DialogueOption) => void;
  onBabelFish: (index: number) => void;
  feedbackMessage: string;
}> = ({ gameState, stats, onChoice, onBabelFish, feedbackMessage }) => {
  const { currentNpc, currentPrompt, currentCountry, journeyStage, babelFishUsed, translatedOptionIndex, feedbackType } = gameState;
  if (!currentNpc || !currentPrompt || !currentCountry) return null;

  const colors = COUNTRY_COLORS[currentCountry];

  return (
    <div className="w-full max-w-2xl flex flex-col h-screen max-h-[95vh] animate-fadeIn">
      {/* Top Bar: Country + Stats */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{COUNTRY_FLAGS[currentCountry]}</span>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>{currentCountry}</span>
        </div>
        <div className="flex items-center gap-3 text-[7px]">
          <span className={stats.hp <= 5 ? 'text-red-400 animate-pulse' : 'text-gray-400'}>HP {stats.hp}/{stats.maxHp}</span>
          <span className="text-gray-600">LVL {stats.level}</span>
        </div>
      </div>

      {/* Journey Progress */}
      <JourneyProgress
        stages={JOURNEY_STAGES}
        currentStage={journeyStage}
        countryColor={colors.primary}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 px-2 overflow-hidden">
        {/* Left: NPC Sprite */}
        <div className="md:w-2/5 flex items-center justify-center flex-shrink-0">
          <SpriteDisplay
            src={currentNpc.image}
            name={currentNpc.name}
            role={currentNpc.role}
          />
        </div>

        {/* Right: Dialogue + Options */}
        <div className="md:w-3/5 flex flex-col min-h-0 flex-1">
          {/* Dialogue Box */}
          <DialogueBox
            localText={currentPrompt.npcLineLocal}
            englishText={currentPrompt.npcLineEnglish}
            npcName={currentNpc.name}
          />

          {/* Feedback Flash */}
          <FeedbackFlash type={feedbackType} message={feedbackMessage} />

          {/* Options */}
          <div className="space-y-2 overflow-y-auto flex-shrink-0 pb-2">
            <p className="text-[7px] text-gray-600 uppercase mb-1">Your Response:</p>
            {currentPrompt.options.map((opt, idx) => {
              const isTranslated = babelFishUsed && translatedOptionIndex === idx;
              const typeColors = {
                [DialogueResultType.POSITIVE]: 'hover:border-green-600',
                [DialogueResultType.NEUTRAL]: 'hover:border-yellow-600',
                [DialogueResultType.OFFENSIVE]: 'hover:border-red-600',
              };

              return (
                <div key={idx} className="flex items-stretch gap-1">
                  <button
                    onClick={() => onChoice(opt)}
                    className={`
                      flex-1 text-left px-3 py-2 border border-gray-700 bg-gray-900/80
                      hover:bg-gray-800 ${typeColors[opt.type]}
                      transition-all duration-150 cursor-pointer group
                    `}
                  >
                    <span className="text-[8px] md:text-[9px] text-white uppercase leading-relaxed">
                      {isTranslated ? opt.textEnglish : opt.textLocal}
                    </span>
                    {isTranslated && (
                      <span className="block text-[6px] text-blue-400 mt-1">🐟 Babel Fish Translation</span>
                    )}
                  </button>
                  {!babelFishUsed && (
                    <button
                      onClick={() => onBabelFish(idx)}
                      className="px-2 bg-gray-900 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer text-[10px]"
                      title="Use Babel Fish to translate this option"
                    >
                      🐟
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex-shrink-0 border-t border-gray-800 pt-2 px-2 mt-auto">
        <div className="grid grid-cols-4 gap-1">
          <StatusBar label="HP" value={stats.hp} max={stats.maxHp} color="bg-red-600" />
          <StatusBar label="Hunger" value={stats.hunger} max={stats.maxHunger} color="bg-yellow-600" />
          <StatusBar label="Thirst" value={stats.thirst} max={stats.maxThirst} color="bg-blue-600" />
          <StatusBar label="Sanity" value={stats.maxInsanity - stats.insanity} max={stats.maxInsanity} color="bg-purple-600" />
        </div>
      </div>
    </div>
  );
};

const EndingScreen: React.FC<{
  ending: 'home' | 'dead' | null;
  stats: PlayerStats;
  onRestart: () => void;
}> = ({ ending, stats, onRestart }) => {
  const isHome = ending === 'home';

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
      <div className="text-5xl md:text-7xl mb-6 animate-idleBob">
        {isHome ? '🏠' : '💀'}
      </div>
      <h1 className="text-lg md:text-2xl mb-4 tracking-tight">
        {isHome ? 'STEVE MADE IT HOME!' : 'STEVE DIDN\'T MAKE IT'}
      </h1>
      <p className="text-[8px] text-gray-400 mb-6 max-w-md leading-relaxed">
        {isHome
          ? 'Against all odds, Steve navigated 6 countries, survived countless awkward conversations, and finally made it back to Idaho. His mom made him potatoes.'
          : stats.hp <= 0
            ? 'Steve\'s health dropped to zero. He collapsed in a European alley, mumbling about ranch dressing. A kind stranger called an ambulance.'
            : 'Steve\'s insanity reached maximum. He now believes he IS a churro. Authorities were called.'
        }
      </p>

      {/* Final Stats */}
      <div className="border border-gray-800 bg-gray-950 p-4 mb-6 max-w-sm w-full">
        <p className="text-[8px] text-gray-500 uppercase mb-3">Final Stats</p>
        <div className="grid grid-cols-2 gap-2 text-[7px]">
          <span className="text-gray-400">Level:</span><span className="text-blue-400">{stats.level}</span>
          <span className="text-gray-400">HP:</span><span className={stats.hp <= 0 ? 'text-red-400' : 'text-green-400'}>{stats.hp}/{stats.maxHp}</span>
          <span className="text-gray-400">Insanity:</span><span className={stats.insanity >= stats.maxInsanity ? 'text-purple-400' : 'text-gray-300'}>{stats.insanity}/{stats.maxInsanity}</span>
          <span className="text-gray-400">Vocab Learned:</span><span className="text-yellow-400">{stats.unlockedVocab.length} words</span>
        </div>
      </div>

      {/* Vocab Summary */}
      {stats.unlockedVocab.length > 0 && (
        <div className="mb-6 max-w-sm w-full">
          <p className="text-[7px] text-gray-600 uppercase mb-2">Vocabulary Unlocked:</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {stats.unlockedVocab.map((v, i) => (
              <span key={i} className="text-[6px] bg-blue-950 border border-blue-900 px-2 py-1 text-blue-300">
                {v.word} = {v.translation}
              </span>
            ))}
          </div>
        </div>
      )}

      <PixelButton onClick={onRestart} variant={isHome ? 'success' : 'danger'} className="px-8 py-3">
        {isHome ? 'PLAY AGAIN' : 'TRY AGAIN'}
      </PixelButton>
    </div>
  );
};

export default App;
