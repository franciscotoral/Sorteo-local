
import React, { useState, useCallback } from 'react';
import { Participant } from '../types';
import { UploadIcon } from './icons/UploadIcon';

declare const XLSX: any; // Using XLSX from CDN

interface FileUploadProps {
  onUpload: (data: { participants: Participant[]; logos: string[]; title: string; description: string }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  
  const [logos, setLogos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.type.includes('spreadsheet') && !file.type.includes('csv') && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        setError('Unsupported file type. Please upload a CSV or Excel file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (json.length === 0) {
            throw new Error("The file is empty.");
        }

        const parsedParticipants: Participant[] = json
          .map((row, index) => ({
            id: `${file.name}-${index}`,
            name: String(row[0] || '').trim(),
          }))
          .filter(p => p.name.length > 0);

        if (parsedParticipants.length === 0) {
            throw new Error("No participant names found in the first column.");
        }

        setParticipants(parsedParticipants);
      } catch (err) {
        console.error("Error parsing file:", err);
        setError(err instanceof Error ? err.message : "Failed to parse the file.");
      }
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
    };
    reader.readAsBinaryString(file);
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleProceed = () => {
    if(participants){
        onUpload({ participants, logos, title, description });
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  if (!participants) {
      const dropzoneClasses = `
        w-full max-w-lg p-10 border-4 border-dashed rounded-2xl cursor-pointer
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-in-out shadow-inner
        ${isDragging ? 'border-blue-400 bg-blue-50 scale-105' : 'border-slate-300 bg-white hover:border-blue-300'}
      `;
      return (
        <div className="text-center animate-slide-in-up">
          <h2 className="text-3xl font-bold mb-2 text-blue-600">Paso 1: Cargar Participantes</h2>
          <p className="text-slate-600 mb-6">Arrastra y suelta tu archivo CSV o Excel a continuación.</p>
          <div
            className={dropzoneClasses}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <UploadIcon className="w-16 h-16 mb-4 text-slate-400 transition-colors duration-300" />
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <p className="text-xl font-semibold text-slate-700">
              Arrastra y suelta tu archivo aquí
            </p>
            <p className="text-slate-500 mt-2">o haz clic para buscar</p>
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      );
  }

  return (
    <div className="w-full max-w-lg text-center animate-fade-in bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-bold mb-2 text-blue-600">Paso 2: Añadir Detalles del Sorteo</h2>
        <p className="text-slate-600 mb-6">Añade la marca e información para el sorteo. (Opcional)</p>
        
        <div className="space-y-4 text-left">
             <div>
                <label htmlFor="raffle-title" className="block text-sm font-medium text-slate-700 mb-1">Título del Sorteo</label>
                <input type="text" id="raffle-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-lg text-slate-900 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="ej., Sorteo día del niño"/>
             </div>
             <div>
                <label htmlFor="raffle-description" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea id="raffle-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-slate-100 border border-slate-300 rounded-lg text-slate-900 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="ej., ¡Un gran agradecimiento a nuestro increíble equipo!"></textarea>
             </div>
             <div>
                 <label htmlFor="logo-upload" className="block text-sm font-medium text-slate-700 mb-1">Logotipos de la Empresa</label>
                 <input type="file" id="logo-upload" onChange={handleLogoChange} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"/>
                 <div className="mt-2 flex items-center gap-4 flex-wrap">
                    {logos.map((logo, index) => (
                        <img key={index} src={logo} alt={`logo-${index}`} className="h-12 bg-slate-100 p-1 rounded border border-slate-200"/>
                    ))}
                 </div>
             </div>
        </div>

        <button
          onClick={handleProceed}
          className="mt-8 w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {`Configurar Sorteo con ${participants.length} Participantes`}
        </button>
    </div>
  )
};

export default FileUpload;