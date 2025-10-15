import { memo } from 'react';
import { SYMBOLS, type SymbolId } from '@/lib/slot-config';
import { cn } from '@/lib/utils';
import { PAYLINE_COLORS } from './winning-lines-display';

interface SymbolDisplayProps {
  symbolId: SymbolId;
  className?: string;
  winningLineIndices?: number[];
}

export const SymbolDisplay = memo(({ symbolId, className, winningLineIndices = [] }: SymbolDisplayProps) => {
  const { icon: Icon } = SYMBOLS[symbolId];
  const isWinning = winningLineIndices.length > 0;
  
  // Use a different color for scatter highlights
  const borderColor = isWinning 
    ? PAYLINE_COLORS[winningLineIndices[0] % PAYLINE_COLORS.length] 
    : undefined;

  return (
    <div
      className={cn(
        'aspect-square w-full h-full flex items-center justify-center bg-black/30 rounded-lg p-2 transition-all duration-300 relative',
        isWinning && 'border-2 animate-pulse-win',
        className
      )}
      style={{
        borderColor: borderColor,
        boxShadow: isWinning ? `0 0 10px ${borderColor}` : undefined
      }}
    >
      <Icon className="w-full h-full drop-shadow-lg" />
    </div>
  );
});

SymbolDisplay.displayName = 'SymbolDisplay';