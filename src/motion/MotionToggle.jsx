import { useMotion } from './MotionContext';

export default function MotionToggle() {
  const { enabled, systemReduced, toggleMotion } = useMotion();
  return <button className="motion-toggle" type="button" onClick={toggleMotion} disabled={systemReduced} aria-label={systemReduced ? 'Reduced motion follows your device setting' : enabled ? 'Pause animations' : 'Enable animations'} title={systemReduced ? 'Following your device’s reduced-motion setting' : undefined}>
    <span className="motion-toggle-icon" aria-hidden="true"><i /><i /><i /></span>
    <span>{systemReduced ? 'Reduced motion' : enabled ? 'Motion on' : 'Motion off'}</span>
  </button>;
}
