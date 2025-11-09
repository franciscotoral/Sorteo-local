
export interface Participant {
  id: string;
  name: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  CONFIG = 'CONFIG',
  DRAWING = 'DRAWING',
  RESULTS = 'RESULTS',
}
