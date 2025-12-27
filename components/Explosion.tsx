
import React from 'react';

const Explosion: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-visible">
      <div className="absolute inset-[-50%] bg-orange-500/30 rounded-full animate-ping duration-300"></div>
      
      {/* Central Flash */}
      <div className="absolute w-8 h-8 bg-white rounded-full blur-md opacity-100 scale-150 transition-all duration-500 animate-[flash_0.4s_ease-out_forwards]"></div>
      
      {/* Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full explosion-particle"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-3px',
            marginLeft: '-3px',
            transform: `rotate(${i * 30}deg) translate(25px)`,
            animationDelay: `${Math.random() * 0.1}s`,
            animationDuration: '0.5s'
          }}
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <div
          key={`inner-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full explosion-particle"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-2px',
            marginLeft: '-2px',
            transform: `rotate(${i * 45 + 15}deg) translate(15px)`,
            animationDelay: `${Math.random() * 0.1}s`,
            animationDuration: '0.4s'
          }}
        />
      ))}
      
      {/* Sunk Ring */}
      <div className="absolute inset-[-20%] border-4 border-red-500/80 rounded-full scale-0 animate-[ping_0.8s_ease-out_forwards]"></div>
    </div>
  );
};

export default Explosion;
