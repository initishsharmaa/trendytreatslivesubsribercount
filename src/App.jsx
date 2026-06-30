import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';

const customStyles = `
  /* Global Resets to extend the white canvas truly full-screen */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow-x: hidden;
  }

  /* Main Container */
  .tracker-container {
    position: relative;
    min-height: 100vh;
    width: 100%;
    background-color: #ffffff;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Particle Confetti Layer */
  .confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
    transition: opacity 1s ease;
  }

  /* Main Minimalist Counter Card */
  .counter-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-sizing: border-box;
  }

  /* Header Section */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .profile-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-wrapper {
    background-color: #f1f5f9;
    padding: 8px;
    border-radius: 12px;
    color: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-info h1 {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .profile-info p {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
    margin: 2px 0 0 0;
  }

  /* Live Pulse Badge */
  .live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: rgba(255, 241, 242, 0.8);
    border: 1px solid #ffe4e6;
    border-radius: 9999px;
    padding: 4px 12px;
    font-size: 10px;
    color: #e11d48;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #f43f5e;
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Counter Block */
  .counter-display {
    text-align: center;
    padding: 24px 0;
    background-color: rgba(248, 250, 252, 0.5);
    border: 1px solid rgba(241, 245, 249, 0.8);
    border-radius: 16px;
  }

  .number-ticker {
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-variant-numeric: tabular-nums;
  }

  .followers-label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  /* Progress Bar styling */
  .progress-wrapper {
    margin-top: 24px;
    padding: 0 24px;
  }

  .progress-bar-bg {
    width: 100%;
    background-color: #f1f5f9;
    height: 8px;
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 9999px;
    background-color: #0f172a;
    transition: width 0.3s ease-out;
  }

  .countdown-helper {
    font-size: 12px;
    color: #64748b;
    margin: 16px 0 0 0;
    font-weight: 500;
  }

  /* Milestone Awards Badge */
  .milestone-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 12px;
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.02em;
    animation: fadeIn 0.5s ease-out forwards;
    margin: 4px auto 0 auto;
  }

  .footer-text {
    margin-top: 32px;
    font-size: 10px;
    color: #94a3b8;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* Pure CSS Keyframes */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function App() {
  const [count, setCount] = useState(98000);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasRef = useRef(null);
  const confettiParticles = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    let interval = null;
    
    interval = setInterval(() => {
      setCount(prev => {
        let increment = 1;
        const remainingTo100k = 100000 - prev;
        
        if (remainingTo100k > 800) {
          // Swift initial climb
          increment = Math.floor(Math.random() * 35) + 25; 
        } else if (remainingTo100k > 150) {
          // Slowing down near milestone to build tension
          increment = Math.floor(Math.random() * 8) + 5;   
        } else if (remainingTo100k > 0) {
          // Precise tick-by-tick crawling for final countdown
          increment = 1; 
        } else {
          // Slower pacing post-100K
          increment = Math.floor(Math.random() * 3) + 1;   
        }

        const nextVal = prev + increment;
        
        // Cap counting loop at 100,100
        if (nextVal >= 100100) {
          clearInterval(interval);
          return 100100;
        }
        return nextVal;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {
    if (count >= 100000 && !showCelebration) {
      setShowCelebration(true);
      triggerConfetti();

      // Automatically reset loop after 15 seconds to loop showcase
      const restartTimeout = setTimeout(() => {
        setShowCelebration(false);
        setCount(98000);
      }, 15000);

      return () => clearTimeout(restartTimeout);
    }
  }, [count, showCelebration]);

  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    confettiParticles.current = [];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];

    for (let i = 0; i < 120; i++) {
      confettiParticles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 5 + 3,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    const updateConfetti = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      confettiParticles.current.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 10;

        if (p.y <= canvas.height) {
          active = true;
        } else {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (active) {
        animationFrameId.current = requestAnimationFrame(updateConfetti);
      }
    };

    updateConfetti();
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="tracker-container">
      {/* Dynamic Style Injection */}
      <style>{customStyles}</style>
      
      {/* Celebration Confetti Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="confetti-canvas"
        style={{ opacity: showCelebration ? 0.8 : 0 }} 
      />

      {/* Main Minimalist Counter Card */}
      <div className="counter-card">
        
        {/* Simple Top Header */}
        <div className="card-header">
          <div className="profile-section">
            <div className="icon-wrapper">
              <svg 
                style={{ width: '20px', height: '20px' }} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div className="profile-info">
              <h1>Queeni & Vishnu</h1>
              <p>@trendytreats24</p>
            </div>
          </div>

          <div className="live-badge">
            <span className="live-dot"></span>
            <span>Live Tracker</span>
          </div>
        </div>

        {/* Counter Block */}
        <div className="counter-display">
          {/* Main Number Display */}
          <div className="number-ticker">
            {formatNumber(count)}
          </div>

          <div className="followers-label">
            <Users style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
            Followers
          </div>

          {/* Minimalist Progress Bar */}
          <div className="progress-wrapper">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${Math.min(100, Math.max(0, ((count - 98000) / 2000) * 100))}%` 
                }}
              />
            </div>
            
            <p className="countdown-helper">
              {count < 100000 
                ? `${formatNumber(100000 - count)} more until 100K` 
                : "100,000 Milestone Reached"}
            </p>
          </div>
        </div>

        {/* Unobtrusive Milestone Highlight */}
        {count >= 100000 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="milestone-badge">
              <Award style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
              <span>100K Silver Club Unlocked</span>
              <Sparkles style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
            </div>
          </div>
        )}

      </div>

      {/* Seamless footer */}
      <footer className="footer-text">
        Live Subscriber Count FOR @TRENDYTREATS24
      </footer>

    </div>
  );
}