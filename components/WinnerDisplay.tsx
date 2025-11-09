
import React from 'react';
import { Participant } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';
import { ReloadIcon } from './icons/ReloadIcon';

interface WinnerDisplayProps {
  winners: Participant[];
  onNewDraw: () => void;
  onReset: () => void;
  hasMoreParticipants: boolean;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winners, onNewDraw, onReset, hasMoreParticipants }) => {
  return (
    <div className="w-full max-w-2xl text-center animate-fade-in p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200">
      <TrophyIcon className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
        ¡Felicidades a {winners.length > 1 ? 'los Ganadores' : 'l Ganador'}!
      </h2>
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {winners.map((winner, index) => (
          <div
            key={winner.id}
            className="bg-slate-100 p-4 rounded-lg shadow-md animate-slide-in-up border border-slate-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-xl font-bold text-blue-600">{winner.name}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {hasMoreParticipants ? (
          <button
            onClick={onNewDraw}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <ReloadIcon className="w-5 h-5" />
            Sortear de Nuevo
          </button>
        ) : (
            <p className="text-lg text-green-600 font-semibold">¡Todos los participantes han sido sorteados!</p>
        )}
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-300 transition-all duration-300"
        >
          Empezar un Nuevo Sorteo
        </button>
      </div>
    </div>
  );
};

export default WinnerDisplay;