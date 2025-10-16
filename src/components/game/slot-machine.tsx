'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BET_AMOUNTS,
  NUM_REELS,
  NUM_ROWS,
  REEL_STRIPS,
  evaluateSpin,
  type SymbolId,
  type WinningLine,
  FREE_SPINS_AWARDED
} from '@/lib/slot-config';
import { getWinningFeedback } from '@/app/actions';
import type { WinningFeedbackEnhancementOutput } from '@/app/actions';
import { ReelColumn } from './reel-column';
import { ControlPanel } from './control-panel';
import { WinAnimation } from './win-animation';
import { WinningLinesDisplay } from './winning-lines-display';
import { useToast } from '@/hooks/use-toast';
import useSound from 'use-sound';
import { SOUNDS } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const generateInitialGrid = (): SymbolId[][] =>
  Array(NUM_REELS)
    .fill(null)
    .map((_, reelIndex) =>
      Array(NUM_ROWS)
        .fill(null)
        .map((_, rowIndex) => REEL_STRIPS[reelIndex][rowIndex])
    );

export function SlotMachine() {
  const [grid, setGrid] = useState<SymbolId[][]>(generateInitialGrid);
  const [spinningReels, setSpinningReels] = useState<boolean[]>(Array(NUM_REELS).fill(false));
  const [balance, setBalance] = useState(100);
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0]);
  const [lastWin, setLastWin] = useState(0);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [winningFeedback, setWinningFeedback] = useState<WinningFeedbackEnhancementOutput | null>(null);
  const { toast } = useToast();

  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const isFreeSpinsMode = useMemo(() => freeSpinsRemaining > 0, [freeSpinsRemaining]);

  const soundConfig = {
    soundEnabled: !isMuted,
    volume: 0.3,
  };

  const [playBgMusic, { stop: stopBgMusic }] = useSound(SOUNDS.background, {
    ...soundConfig,
    loop: true
  });
  const [playSpinSound, { stop: stopSpinSound }] = useSound(SOUNDS.spin, {
    ...soundConfig,
    loop: false,
  });
  const [playReelStopSound] = useSound(SOUNDS.reelStop, { ...soundConfig, loop: false });
  const [playWinSound] = useSound(SOUNDS.win, soundConfig);
  const [playBigWinSound] = useSound(SOUNDS.bigWin, soundConfig);
  const [playFreeSpinsTriggerSound] = useSound(SOUNDS.featureTrigger, soundConfig);

  useEffect(() => {
    if (!isMuted) {
      playBgMusic();
    }
    return () => {
      stopBgMusic();
    };
  }, [playBgMusic, stopBgMusic, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const isSpinning = useMemo(() => spinningReels.some(s => s), [spinningReels]);

  const handleIncreaseBet = () => {
    if (isFreeSpinsMode) return;
    const currentIndex = BET_AMOUNTS.indexOf(betAmount);
    const nextIndex = (currentIndex + 1) % BET_AMOUNTS.length;
    setBetAmount(BET_AMOUNTS[nextIndex]);
  };

  const spin = useCallback(async () => {
    if (isSpinning) return;

    if (balance < betAmount && freeSpinsRemaining === 0) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You don't have enough balance to place that bet.",
      });
      return;
    }

    stopSpinSound();
    playSpinSound();

    if (freeSpinsRemaining > 0) {
        setFreeSpinsRemaining(prev => prev - 1);
    } else {
        setBalance(prev => prev - betAmount);
    }

    setLastWin(0);
    setWinningLines([]);
    setWinningFeedback(null);
    setSpinningReels(Array(NUM_REELS).fill(true));

    const newFinalGrid = REEL_STRIPS.map((strip) => {
        const finalStopIndex = Math.floor(Math.random() * strip.length);
        return Array(NUM_ROWS).fill(null).map((_, i) => strip[(finalStopIndex + i) % strip.length]);
    });

    for (let i = 0; i < NUM_REELS; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 150));
        playReelStopSound();
        setSpinningReels(prev => {
            const newSpinning = [...prev];
            newSpinning[i] = false;
            return newSpinning;
        });

        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[i] = newFinalGrid[i];
            return newGrid;
        });
    }

    stopSpinSound();
    await new Promise(resolve => setTimeout(resolve, 100));

    setGrid(newFinalGrid);

    const { totalWin, winningLines, scatterWin } = evaluateSpin(newFinalGrid, betAmount);

    if (scatterWin.triggeredFreeSpins) {
        setFreeSpinsRemaining(prev => prev + FREE_SPINS_AWARDED);
        playFreeSpinsTriggerSound();
        toast({
            title: "Free Spins Triggered!",
            description: `You won ${FREE_SPINS_AWARDED} free spins!`,
            duration: 5000,
        });
    }

    if (totalWin > 0) {
      setBalance(prev => prev + totalWin);
      setLastWin(totalWin);
      setWinningLines(winningLines);

      if (totalWin > betAmount * 10) {
          playBigWinSound();
      } else {
          playWinSound();
      }

      const winningSymbols = [...new Set(winningLines.map(l => l.symbol))];
      const feedback = await getWinningFeedback({
          winAmount: totalWin,
          winningSymbols: winningSymbols,
          betAmount: betAmount
      });
      setWinningFeedback(feedback);
    }
  }, [isSpinning, balance, betAmount, freeSpinsRemaining, toast, playSpinSound, stopSpinSound, playReelStopSound, playWinSound, playBigWinSound, playFreeSpinsTriggerSound]);

  useEffect(() => {
    if (freeSpinsRemaining > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        spin();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [freeSpinsRemaining, isSpinning, spin]);


  const getReelSymbols = (reelIndex: number) => {
    if (spinningReels[reelIndex]) {
      return REEL_STRIPS[reelIndex];
    }
    return grid[reelIndex];
  }

  const getWinningLineIndices = (reelIndex: number, rowIndex: number): number[] => {
    if (winningLines.length === 0) return [];

    return winningLines.reduce((acc, line, lineIndex) => {
      if (line.paylineIndex !== -1 && line.line[reelIndex] === rowIndex && (reelIndex < line.count)) {
        acc.push(line.paylineIndex);
      }
      else if (line.paylineIndex === -1) {
          const gridSymbol = grid[reelIndex][rowIndex];
          if (gridSymbol === line.symbol) {
              acc.push(10);
          }
      }
      return acc;
    }, [] as number[]);
  }

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 p-2 md:p-4 rounded-2xl bg-card/50 border-2 md:border-4 border-primary/50 shadow-2xl w-full max-w-6xl relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="rounded-full w-10 h-10 p-2 bg-black/50 hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-headline text-accent tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        Snow Kingdom
      </h1>

      <div className="relative w-full flex justify-center">
        <div className="grid grid-cols-6 gap-2 p-2 bg-black/30 rounded-lg">
          {Array.from({ length: NUM_REELS }).map((_, i) => (
            <ReelColumn
              key={i}
              symbols={getReelSymbols(i)}
              isSpinning={spinningReels[i]}
              reelIndex={i}
              winningLineIndicesForColumn={
                Array(NUM_ROWS).fill(0).map((_, j) => getWinningLineIndices(i, j))
              }
            />
          ))}
        </div>
        {!isSpinning && winningLines.length > 0 && <WinningLinesDisplay winningLines={winningLines.filter(l => l.paylineIndex !== -1)} />}
      </div>


      <ControlPanel
        betAmount={betAmount}
        balance={balance}
        lastWin={lastWin}
        isSpinning={isSpinning}
        onSpin={spin}
        onIncreaseBet={handleIncreaseBet}
        freeSpinsRemaining={freeSpinsRemaining}
        isFreeSpinsMode={isFreeSpinsMode}
      />

      {winningFeedback && (
          <WinAnimation
            feedback={winningFeedback}
            onAnimationComplete={() => {
              setWinningFeedback(null)
              if (!isFreeSpinsMode) setWinningLines([]);
            }}
          />
      )}
    </div>
  );
}