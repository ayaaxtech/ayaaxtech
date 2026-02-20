
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Trophy, Hash, Grid, Award, RotateCcw, Target, Shield, Sword, Box, Backpack, Zap, Hammer, Loader2, User, ChevronUp } from 'lucide-react';

interface GameHubProps {
  onBack: () => void;
}

const GAMES = [
  { id: 'battlearena', label: 'Battle Arena', icon: Sword, color: 'text-orange-400' },
  { id: 'tictactoe', label: 'Tic Tac Toe', icon: Hash, color: 'text-blue-400' },
  { id: 'row4', label: 'Row of 4', icon: Grid, color: 'text-yellow-400' },
];

const SKIN_TONES = ['#F5C2A2', '#8D5524', '#C68642', '#E0AC69', '#FFDBAC'];
const HAIR_COLORS = ['#000000', '#4B2C20', '#D4AF37', '#923E3E', '#F1E5AC'];

export const GameHub: React.FC<GameHubProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [showBackpack, setShowBackpack] = useState(false);
  
  // Battle Arena State
  const [arenaState, setArenaState] = useState({
    player: { 
      x: 50, y: 300, vx: 0, vy: 0, hp: 100, shield: 100, jumping: false, dir: 1, 
      gender: 'girl', skin: SKIN_TONES[0], hair: HAIR_COLORS[2], materials: 100, grenades: 5, pots: 3 
    },
    enemies: [] as any[],
    bullets: [] as any[],
    grenades: [] as any[],
    buildings: [] as any[],
    loot: [] as any[],
    stormWidth: 0,
    isGameOver: false,
    survivors: 10,
    isBuilding: false
  });

  const basePlatforms = [
    { x: 0, y: 450, w: 500, h: 50 }, // Ground
    { x: 50, y: 320, w: 100, h: 10 },
    { x: 350, y: 320, w: 100, h: 10 },
    { x: 200, y: 200, w: 100, h: 10 },
  ];

  const arenaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  const initArena = () => {
    setIsDeploying(true);
    setDeployProgress(0);
    
    const enemies = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      x: 100 + Math.random() * 350,
      y: 100 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 3,
      vy: 0,
      hp: 100,
      shield: 50,
      alive: true,
      gender: Math.random() > 0.5 ? 'boy' : 'girl',
      skin: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hair: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)]
    }));
    
    const loot = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 50 + Math.random() * 400,
      y: 50 + Math.random() * 350,
      type: Math.random() > 0.5 ? 'hp' : 'shield'
    }));

    setArenaState({
      player: { 
        x: 50, y: 300, vx: 0, vy: 0, hp: 100, shield: 100, jumping: false, dir: 1, 
        gender: Math.random() > 0.5 ? 'girl' : 'boy', 
        skin: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
        hair: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
        materials: 50, grenades: 5, pots: 2 
      },
      enemies,
      bullets: [],
      grenades: [],
      buildings: [],
      loot,
      stormWidth: 0,
      isGameOver: false,
      survivors: 10,
      isBuilding: false
    });

    const interval = setInterval(() => {
      setDeployProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDeploying(false);
            gameLoopRef.current = requestAnimationFrame(updateArena);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const updateArena = () => {
    setArenaState(prev => {
      if (prev.isGameOver) return prev;

      let { player, enemies, bullets, grenades, buildings, loot, stormWidth, survivors } = prev;
      const gravity = 0.6;
      const friction = 0.8;
      const speed = 0.9;
      const jumpStrength = -13;

      if (keysPressed.current.has('a')) { player.vx -= speed; player.dir = -1; }
      if (keysPressed.current.has('d')) { player.vx += speed; player.dir = 1; }
      if ((keysPressed.current.has('w') || keysPressed.current.has(' ')) && !player.jumping) {
        player.vy = jumpStrength;
        player.jumping = true;
      }

      player.vx *= friction;
      player.vy += gravity;
      player.x += player.vx;
      player.y += player.vy;

      const allPlatforms = [...basePlatforms, ...buildings];
      allPlatforms.forEach(p => {
        if (player.x + 20 > p.x && player.x < p.x + p.w && player.y + 45 > p.y && player.y + 45 < p.y + p.h + 10 && player.vy >= 0) {
          player.y = p.y - 45;
          player.vy = 0;
          player.jumping = false;
        }
      });

      player.x = Math.max(0, Math.min(480, player.x));
      if (player.y > 550) player.hp = 0;

      stormWidth += 0.15;
      if (player.x < stormWidth || player.x > 500 - stormWidth) {
        if (player.shield > 0) player.shield -= 0.6;
        else player.hp -= 0.6;
      }

      bullets = bullets.map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy })).filter(b => b.x > 0 && b.x < 500 && b.y > 0 && b.y < 500);

      grenades = grenades.map(g => {
        g.vy += 0.5;
        g.x += g.vx;
        g.y += g.vy;
        g.timer -= 1;
        if (g.y > 440) { g.y = 440; g.vy *= -0.4; g.vx *= 0.8; }
        if (g.timer <= 0) {
          enemies.forEach(e => {
            if (e.alive && Math.sqrt((g.x - e.x)**2 + (g.y - e.y)**2) < 100) {
              e.hp -= 90;
              if (e.hp <= 0) { e.alive = false; survivors--; }
            }
          });
          if (Math.sqrt((g.x - player.x)**2 + (g.y - player.y)**2) < 100) player.hp -= 50;
          g.dead = true;
        }
        return g;
      }).filter(g => !g.dead);

      bullets.forEach(b => {
        enemies.forEach(e => {
          if (e.alive && Math.sqrt((b.x - e.x)**2 + (b.y - (e.y+20))**2) < 30) {
            if (e.shield > 0) e.shield -= 30;
            else e.hp -= 30;
            b.dead = true;
            if (e.hp <= 0) { e.alive = false; survivors--; }
          }
        });
      });
      bullets = bullets.filter(b => !b.dead);

      loot = loot.filter(l => {
        if (Math.sqrt((player.x + 10 - l.x)**2 + (player.y + 25 - l.y)**2) < 35) {
          if (l.type === 'hp') player.hp = Math.min(100, player.hp + 30);
          else if (l.type === 'shield') player.shield = Math.min(100, player.shield + 50);
          return false;
        }
        return true;
      });

      enemies.forEach(e => {
        if (!e.alive) return;
        e.vy += gravity;
        e.x += e.vx;
        e.y += e.vy;
        allPlatforms.forEach(p => {
          if (e.x + 20 > p.x && e.x < p.x + p.w && e.y + 40 > p.y && e.y + 40 < p.y + p.h + 10 && e.vy >= 0) {
            e.y = p.y - 40; e.vy = 0;
          }
        });
        if (e.x < 0 || e.x > 480) e.vx *= -1;
        if (Math.sqrt((player.x - e.x)**2 + (player.y - e.y)**2) < 40) player.hp -= 0.5;
        if (Math.random() < 0.015 && e.vy === 0) e.vy = jumpStrength;
      });

      return { ...prev, player, enemies, bullets, grenades, loot, stormWidth, survivors, isGameOver: player.hp <= 0 || survivors <= 1 };
    });
    gameLoopRef.current = requestAnimationFrame(updateArena);
  };

  const handleAction = (e: React.MouseEvent) => {
    if (arenaState.isGameOver || isDeploying) return;
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (arenaState.isBuilding) {
      if (arenaState.player.materials >= 10) {
        setArenaState(prev => ({
          ...prev,
          buildings: [...prev.buildings, { x: clickX - 25, y: clickY - 5, w: 50, h: 10 }],
          player: { ...prev.player, materials: prev.player.materials - 10 }
        }));
      }
    } else {
      const dx = clickX - (arenaState.player.x + 10);
      const dy = clickY - (arenaState.player.y + 25);
      const angle = Math.atan2(dy, dx);
      setArenaState(prev => ({
        ...prev,
        bullets: [...prev.bullets, { x: prev.player.x + 10, y: prev.player.y + 25, vx: Math.cos(angle)*15, vy: Math.sin(angle)*15 }]
      }));
    }
  };

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (isDeploying) return;
      const k = e.key.toLowerCase();
      if (e.type === 'keydown') {
        keysPressed.current.add(k);
        if (k === 'tab') { e.preventDefault(); setShowBackpack(p => !p); }
        if (k === 'b') setArenaState(p => ({ ...p, isBuilding: !p.isBuilding }));
        if (k === 'g' && arenaState.player.grenades > 0) {
          setArenaState(p => ({
            ...p,
            grenades: [...p.grenades, { x: p.player.x + 10, y: p.player.y + 10, vx: p.player.dir * 10, vy: -12, timer: 100 }],
            player: { ...p.player, grenades: p.player.grenades - 1 }
          }));
        }
        if (k === 'k' && arenaState.player.pots > 0) {
          setArenaState(p => ({
            ...p,
            player: { ...p.player, shield: Math.min(100, p.player.shield + 50), pots: p.player.pots - 1 }
          }));
        }
      } else {
        keysPressed.current.delete(k);
      }
    };

    window.addEventListener('keydown', handleKeys);
    window.addEventListener('keyup', handleKeys);
    if (activeGame === 'battlearena') {
      initArena();
    }
    return () => {
      window.removeEventListener('keydown', handleKeys);
      window.removeEventListener('keyup', handleKeys);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [activeGame]);

  const CharacterSprite = ({ state, isPlayer = false }: { state: any, isPlayer?: boolean, key?: any }) => (
    <div className="absolute flex flex-col items-center" style={{ left: state.x, top: state.y, width: 30, height: 50 }}>
      <div className="absolute -top-10 w-12 flex flex-col gap-1 z-20">
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)] transition-all" style={{ width: `${state.shield}%` }} />
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] transition-all" style={{ width: `${state.hp}%` }} />
        </div>
      </div>
      <div className="relative w-full h-full drop-shadow-lg">
        <svg viewBox="0 0 40 60" className="w-full h-full">
          <circle cx="20" cy="12" r="8" fill={state.skin} />
          <path d={state.gender === 'girl' ? "M10,12 Q10,2 20,2 Q30,2 30,12 L32,25 Q20,20 8,25 Z" : "M12,8 Q20,0 28,8 L20,6 Z"} fill={state.hair} />
          <rect x="10" cy="20" width="20" height="25" rx="4" fill={isPlayer ? '#2563eb' : '#3f3f46'} />
          <rect x="12" cy="24" width="16" height="12" rx="2" fill="#18181b" opacity="0.6" />
          <rect x="11" cy="20" width="2" height="15" fill="#111" />
          <rect x="27" cy="20" width="2" height="15" fill="#111" />
          <g transform={`rotate(${state.vx * 5}, 20, 25)`}>
            <rect x={state.dir > 0 ? "25" : "5"} y="28" width="18" height="6" rx="2" fill="#222" transform={state.dir > 0 ? "" : "translate(-10, 0)"} />
            <rect x={state.dir > 0 ? "40" : "-5"} y="29" width="4" height="4" fill="#000" />
          </g>
          <rect x="12" y="45" width="6" height="12" rx="2" fill="#222" transform={state.vx !== 0 ? `rotate(${Math.sin(Date.now()/100)*15}, 15, 45)` : ''} />
          <rect x="22" y="45" width="6" height="12" rx="2" fill="#222" transform={state.vx !== 0 ? `rotate(${Math.cos(Date.now()/100)*15}, 25, 45)` : ''} />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-10 relative overflow-hidden font-sans bg-black">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

       {activeGame === 'battlearena' && (
         <div className="flex-1 flex flex-col items-center justify-center animate-[scaleIn_0.3s]">
            {isDeploying && (
              <div className="absolute inset-0 z-[500] bg-black flex flex-col items-center justify-center p-12">
                 <div className="relative mb-20">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="flex items-center gap-12">
                       <div className="w-40 h-64 opacity-20 transform -rotate-12 animate-[wiggle_4s_infinite]">
                          <CharacterSprite state={{ ...arenaState.player, x:0, y:0, hp:100, shield:100 }} />
                       </div>
                       <div className="w-64 h-96 relative z-10 animate-[bounce_3s_infinite]">
                          <CharacterSprite state={{ ...arenaState.player, x:0, y:0, hp:100, shield:100 }} isPlayer={true} />
                       </div>
                       <div className="w-40 h-64 opacity-20 transform rotate-12 animate-[wiggle_4s_infinite]">
                          <CharacterSprite state={{ ...arenaState.enemies[0], x:0, y:0, hp:100, shield:100 }} />
                       </div>
                    </div>
                 </div>
                 <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-between items-end">
                       <div>
                          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Deploying Operator</h2>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.5em]">Neural Link: {deployProgress}%</p>
                       </div>
                       <Loader2 className="text-primary animate-spin" size={24} />
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div className="h-full bg-primary shadow-neon transition-all duration-300" style={{ width: `${deployProgress}%` }} />
                    </div>
                 </div>
              </div>
            )}

            <div className="relative w-[500px] h-[500px] bg-gradient-to-b from-zinc-950 to-black border-4 border-white/10 rounded-[3.5rem] overflow-hidden cursor-crosshair shadow-2xl" ref={arenaRef} onClick={handleAction}>
               <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-30" />
               {basePlatforms.map((p, i) => (
                 <div key={i} className="absolute bg-zinc-800 border-t-2 border-white/10 shadow-lg" style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />
               ))}
               {arenaState.buildings.map((p, i) => (
                 <div key={i} className="absolute bg-blue-900/30 border-2 border-blue-400/30 rounded-lg backdrop-blur-sm animate-[scaleIn_0.2s]" style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />
               ))}
               <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-900/60 to-transparent backdrop-blur-[2px] transition-all" style={{ width: arenaState.stormWidth }} />
               <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-900/60 to-transparent backdrop-blur-[2px] transition-all" style={{ width: arenaState.stormWidth }} />
               {arenaState.loot.map(l => (
                 <div key={l.id} className={`absolute w-6 h-6 ${l.type === 'hp' ? 'bg-green-500' : 'bg-blue-400'} rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center animate-bounce border-2 border-white/20`} style={{ left: l.x, top: l.y }}>
                    <Box size={14} className="text-white" />
                 </div>
               ))}
               {arenaState.enemies.filter(e => e.alive).map(e => <CharacterSprite key={e.id} state={e} />)}
               <CharacterSprite state={arenaState.player} isPlayer={true} />
               {arenaState.bullets.map((b, i) => (
                 <div key={i} className="absolute w-2.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse" style={{ left: b.x, top: b.y, transform: `rotate(${Math.atan2(b.vy, b.vx)}rad)` }} />
               ))}
               {arenaState.grenades.map((g, i) => (
                 <div key={i} className="absolute w-4 h-4 bg-zinc-700 rounded-full border-2 border-zinc-900 shadow-xl flex items-center justify-center" style={{ left: g.x, top: g.y }}>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                 </div>
               ))}
               <div className="absolute top-8 left-8 flex gap-4">
                 <div className={`px-6 py-2.5 rounded-[2rem] border-2 transition-all flex items-center gap-3 backdrop-blur-md ${arenaState.isBuilding ? 'bg-primary/20 border-primary text-white shadow-neon' : 'bg-black/60 border-white/10 text-white'}`}>
                    <Hammer size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{arenaState.player.materials}</span>
                 </div>
                 <div className="bg-black/60 px-6 py-2.5 rounded-[2rem] border border-white/10 text-[11px] font-bold uppercase text-white shadow-xl flex items-center gap-3 backdrop-blur-md">
                    <Shield size={14} className="text-accent" />
                    <span className="tracking-widest">{Math.ceil(arenaState.player.hp)}%</span>
                 </div>
               </div>
               {showBackpack && (
                 <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-[60] flex items-center justify-center animate-[fadeIn_0.2s]">
                    <div className="w-96 bg-zinc-950 border border-white/10 rounded-[4rem] p-12 text-center shadow-2xl relative">
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 p-6 bg-primary/20 border border-primary/40 rounded-[2rem] shadow-neon">
                          <Backpack size={32} className="text-white" />
                       </div>
                       <h3 className="text-3xl font-bold text-white uppercase tracking-tighter mt-4 mb-8">Tactical Gear</h3>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-primary/50 transition-all">
                             <div className="text-[9px] text-muted font-bold uppercase mb-2 tracking-widest">Frag Grenades [G]</div>
                             <div className="text-3xl font-bold text-white">{arenaState.player.grenades}</div>
                          </div>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-accent/50 transition-all">
                             <div className="text-[9px] text-muted font-bold uppercase mb-2 tracking-widest">Shield Juice [K]</div>
                             <div className="text-3xl font-bold text-white">{arenaState.player.pots}</div>
                          </div>
                       </div>
                       <button onClick={() => setShowBackpack(false)} className="mt-12 text-[10px] font-bold uppercase text-white tracking-[0.5em] animate-pulse">Close Link (TAB)</button>
                    </div>
                 </div>
               )}
               {arenaState.isGameOver && (
                 <div className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center z-[100] animate-[fadeIn_0.5s]">
                    <div className="p-16 text-center bg-zinc-950 border-2 border-white/10 rounded-[4rem] shadow-2xl relative">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-8 bg-zinc-900 border border-gold/40 text-gold rounded-[2.5rem] shadow-neon animate-bounce">
                        <Trophy size={48} />
                      </div>
                      <h3 className="text-5xl font-bold text-white uppercase tracking-tighter mt-4 mb-2">
                        {arenaState.player.hp <= 0 ? "Offline" : "Champion"}
                      </h3>
                      <p className="text-muted text-[10px] font-bold uppercase tracking-[0.6em] mb-12">Sim Rank: #{arenaState.survivors}</p>
                      <button onClick={initArena} className="w-full flex items-center justify-center gap-4 bg-zinc-900 border border-white/20 text-white py-6 rounded-[2rem] font-bold uppercase text-xs tracking-widest shadow-neon transition-all hover:bg-zinc-800 active:scale-95">
                        <RotateCcw size={20} /> Re-Initialize
                      </button>
                    </div>
                 </div>
               )}
            </div>
            <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-3 w-[500px]">
               {[
                 { key: 'W/A/D', label: 'Combat Move' },
                 { key: 'G', label: 'Grenade' },
                 { key: 'B', label: 'Build' },
                 { key: 'K', label: 'Shield' },
                 { key: 'TAB', label: 'Pack' },
                 { key: 'CLICK', label: 'Fire' }
               ].map(c => (
                 <div key={c.key} className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl text-center group hover:border-primary/40 transition-all">
                    <div className="text-[11px] font-bold text-white uppercase tracking-widest">{c.key}</div>
                    <div className="text-[7px] font-bold text-muted uppercase tracking-[0.2em] mt-1.5">{c.label}</div>
                 </div>
               ))}
            </div>
         </div>
       )}

       {!activeGame && (
         <div className="flex-1 flex items-center justify-center animate-[fadeIn_0.5s]">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl w-full">
              {GAMES.map(game => (
                 <button 
                  key={game.id}
                  onClick={() => { setActiveGame(game.id); }}
                  className={`group p-12 border border-white/5 rounded-[4rem] hover:border-primary hover:bg-primary/5 transition-all text-center flex flex-col items-center justify-center shadow-bubbly aspect-square bubbly-button bg-zinc-900/40 backdrop-blur-md`}
                 >
                    <div className={`p-8 bg-white/5 rounded-[2.5rem] mb-6 ${game.color} group-hover:scale-110 group-hover:shadow-neon transition-all`}><game.icon size={44} /></div>
                    <span className="text-[13px] font-bold text-white uppercase tracking-[0.3em]">{game.label}</span>
                 </button>
              ))}
           </div>
         </div>
       )}
    </div>
  );
};
