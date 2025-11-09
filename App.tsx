
import React, { useState, useCallback } from 'react';
import { AppState, Participant } from './types';
import FileUpload from './components/FileUpload';
import RaffleAnimation from './components/RaffleAnimation';
import WinnerDisplay from './components/WinnerDisplay';
import { UserGroupIcon } from './components/icons/UserGroupIcon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [numberOfWinners, setNumberOfWinners] = useState<number>(1);
  const [key, setKey] = useState<number>(0);

  const [logos, setLogos] = useState<string[]>([]);
  const [raffleTitle, setRaffleTitle] = useState('');
  const [raffleDescription, setRaffleDescription] = useState('');


  const handleFileUpload = useCallback((data: { participants: Participant[]; logos: string[]; title: string; description: string }) => {
    setParticipants(data.participants);
    setAvailableParticipants(data.participants);
    setLogos(data.logos);
    setRaffleTitle(data.title);
    setRaffleDescription(data.description);
    setWinners([]);
    setAppState(AppState.CONFIG);
  }, []);

  const handleDrawComplete = useCallback((newWinners: Participant[]) => {
    setWinners(newWinners);
    const remaining = availableParticipants.filter(p => !newWinners.some(w => w.id === p.id));
    setAvailableParticipants(remaining);
    setAppState(AppState.RESULTS);
  }, [availableParticipants]);

  const handleStartDraw = () => {
    if (numberOfWinners > 0 && numberOfWinners <= availableParticipants.length) {
      setAppState(AppState.DRAWING);
    } else {
      alert("Please enter a valid number of winners.");
    }
  };

  const handleNewDraw = () => {
    setWinners([]);
    setAppState(AppState.CONFIG);
  };

  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setParticipants([]);
    setAvailableParticipants([]);
    setWinners([]);
    setNumberOfWinners(1);
    setLogos([]);
    setRaffleTitle('');
    setRaffleDescription('');
    setKey(prevKey => prevKey + 1);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOAD:
        return <FileUpload key={key} onUpload={handleFileUpload} />;
      case AppState.CONFIG:
        return (
          <div className="w-full max-w-md mx-auto text-center animate-fade-in bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Configura tu Sorteo</h2>
            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-lg shadow-inner mb-6">
                <UserGroupIcon className="w-6 h-6 mr-3 text-blue-500" />
                <span className="text-xl font-semibold">{availableParticipants.length}</span>
                <span className="ml-2 text-slate-600">Participantes Restantes</span>
            </div>
            <div className="mb-6">
              <label htmlFor="winners-count" className="block text-lg font-medium text-slate-700 mb-2">
                Número de Ganadores
              </label>
              <input
                id="winners-count"
                type="number"
                min="1"
                max={availableParticipants.length}
                value={numberOfWinners}
                onChange={(e) => setNumberOfWinners(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg text-slate-900 text-center text-2xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Number of winners"
              />
            </div>
            <button
              onClick={handleStartDraw}
              className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold py-4 px-6 rounded-lg text-xl hover:from-blue-600 hover:to-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Comenzar Sorteo
            </button>
             <button
              onClick={handleReset}
              className="mt-4 text-slate-500 hover:text-blue-600 transition-colors"
            >
              Empezar de nuevo con un nuevo archivo
            </button>
          </div>
        );
      case AppState.DRAWING:
        return (
          <RaffleAnimation
            participants={availableParticipants}
            count={numberOfWinners}
            onComplete={handleDrawComplete}
          />
        );
      case AppState.RESULTS:
        return (
          <WinnerDisplay
            winners={winners}
            onNewDraw={handleNewDraw}
            onReset={handleReset}
            hasMoreParticipants={availableParticipants.length > 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
       <header className="absolute top-0 left-0 right-0 p-6 text-center">
         <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
           Sorteos locales
         </h1>
      </header>

      {appState !== AppState.UPLOAD && (
          <div className="w-full max-w-4xl mx-auto text-center my-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200 animate-fade-in shadow">
              {logos.length > 0 && (
                  <div className="flex justify-center items-center gap-x-6 mb-4">
                      {logos.map((logo, i) => <img key={i} src={logo} alt="brand logo" className="h-16 max-w-xs object-contain" />)}
                  </div>
              )}
              {raffleTitle && <h2 className="text-3xl font-bold text-slate-900">{raffleTitle}</h2>}
              {raffleDescription && <p className="text-slate-600 mt-2 max-w-2xl mx-auto">{raffleDescription}</p>}
          </div>
      )}

      <main className="w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
      <footer className="w-full text-center p-4 text-slate-500 text-sm">
        © 2025 Techne Soluciones. All rights reserved.
        Empoering technical excellence and innovation.
      </footer>
    </div>
  );
};

export default App;