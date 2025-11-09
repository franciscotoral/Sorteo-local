
import React, { useState, useEffect, useMemo } from 'react';
import { Participant } from '../types';

interface RaffleAnimationProps {
  participants: Participant[];
  count: number;
  onComplete: (winners: Participant[]) => void;
}

const RaffleAnimation: React.FC<RaffleAnimationProps> = ({ participants, count, onComplete }) => {
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [drawnWinners, setDrawnWinners] = useState<Participant[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  
  const availableParticipants = useMemo(() => {
    return participants.filter(p => !drawnWinners.some(w => w.id === p.id));
  }, [participants, drawnWinners]);

  useEffect(() => {
    if (drawnWinners.length >= count || availableParticipants.length === 0) {
      setIsDrawing(false);
      setTimeout(() => onComplete(drawnWinners), 2000);
      return;
    }

    setIsDrawing(true);
    setCurrentWinner(null);

    const animationInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setDisplayName(availableParticipants[randomIndex].name);
    }, 75);

    const drawTimeout = setTimeout(() => {
      clearInterval(animationInterval);
      const winnerIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[winnerIndex];
      setCurrentWinner(winner);
      setDisplayName(winner.name);
      setDrawnWinners(prev => [...prev, winner]);
    }, 3000); // 3 seconds of animation per winner

    return () => {
      clearInterval(animationInterval);
      clearTimeout(drawTimeout);
    };
  }, [drawnWinners, count, onComplete, availableParticipants]);
  
  if (!isDrawing && drawnWinners.length > 0) {
      return (
          <div className="text-center animate-fade-in">
              <h2 className="text-4xl font-bold text-green-500">¡Sorteo Completado!</h2>
          </div>
      )
  }

  return (
    <div className="w-full max-w-2xl text-center p-8 bg-white rounded-2xl shadow-2xl border border-slate-200">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {currentWinner ? '¡Tenemos un ganador!' : `Sorteando Ganador ${drawnWinners.length + 1} de ${count}...`}
      </h2>
      <div className="relative h-48 flex items-center justify-center bg-slate-800 rounded-lg overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-blue-500/10 animate-pulse"></div>
        <div 
          className={`
            text-5xl font-extrabold transition-all duration-300
            ${currentWinner ? 'text-yellow-300 scale-125 animate-fade-in' : 'text-white'}
          `}
          style={{textShadow: '0 0 15px rgba(253, 224, 71, 0.5)'}}
        >
          {displayName}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg text-slate-500">Ganadores Anunciados:</h3>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
            {drawnWinners.map(winner => (
                <span key={winner.id} className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm animate-slide-in-up">
                    {winner.name}
                </span>
            ))}
            {drawnWinners.length === 0 && <p className="text-slate-400">Ninguno todavía...</p>}
        </div>
      </div>
    </div>
  );
};

export default RaffleAnimation;