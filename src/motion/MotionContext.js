import { createContext, useContext } from 'react';

export const MotionContext = createContext({ enabled: true, systemReduced: false, toggleMotion: () => {} });
export const useMotion = () => useContext(MotionContext);
