import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PAYLINES, SYMBOLS, type SymbolId } from '@/lib/slot-config';
import { SymbolDisplay } from './symbol-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';

export function PayTableDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-headline tracking-wider">Pay Table</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-accent text-3xl">Pay Table</DialogTitle>
          <DialogDescription>Winning combinations and payouts.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-8">
            <section>
                <h3 className="font-headline text-2xl text-accent mb-4">Payouts</h3>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>6x</TableHead>
                        <TableHead>5x</TableHead>
                        <TableHead>4x</TableHead>
                        <TableHead>3x</TableHead>
                        <TableHead>2x</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {Object.values(SYMBOLS).map((symbol) => (
                        <TableRow key={symbol.id}>
                        <TableCell className="flex items-center gap-2 font-bold">
                            <div className="w-10 h-10"><SymbolDisplay symbolId={symbol.id} /></div>
                            <span>{symbol.name}</span>
                        </TableCell>
                        <TableCell>{symbol.payout[6] || '-'}</TableCell>
                        <TableCell>{symbol.payout[5] || '-'}</TableCell>
                        <TableCell>{symbol.payout[4] || '-'}</TableCell>
                        <TableCell>{symbol.payout[3] || '-'}</TableCell>
                        <TableCell>{symbol.payout[2] || '-'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </section>
            
            <section>
                <h3 className="font-headline text-2xl text-accent mb-4">Paylines</h3>
                <p className="text-muted-foreground mb-4">Wins are awarded for left-to-right matching symbols on 10 fixed paylines.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {PAYLINES.map((line, index) => (
                    <div key={index} className="p-2 border rounded-lg bg-card/50">
                        <p className="text-center font-bold text-accent mb-2">Line {index + 1}</p>
                        <div className="grid grid-cols-6 gap-1">
                        {Array.from({ length: 4 }).map((_, rowIndex) =>
                            Array.from({ length: 6 }).map((_, colIndex) => {
                            const isPayline = line[colIndex] === rowIndex;
                            return (
                                <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-3 h-3 rounded-full ${isPayline ? 'bg-accent' : 'bg-muted/30'}`}
                                />
                            );
                            })
                        )}
                        </div>
                    </div>
                    ))}
                </div>
            </section>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
