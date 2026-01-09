import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Terminal, 
  Cpu, 
  Info,
  CheckCircle2,
  Pause,
  ArrowRight,
  Instagram,
  Github,
  Linkedin,
  Heart,
  Code,
  Zap,
  Sparkles,
  Trophy,
  History as HistoryIcon, // Renamed to avoid global conflict
  List as ListIcon        // Added missing import
} from 'lucide-react';

// --- Very Easy English Logic Steps ---
const CODE_STEPS = [
  { text: 'CLS', title: 'Clean Up', detail: 'This removes old text and makes the screen clean.' },
  { text: 'INPUT n', title: 'Pick a Number', detail: 'The computer takes your number and saves it in a box named "n".' },
  { text: 'rev = 0', title: 'Empty Basket', detail: 'We take an empty basket named "rev" to hold our answer.' },
  { text: 'WHILE n > 0', title: 'Checking', detail: 'The computer asks: "Is n still bigger than 0?"' },
  { text: '  rem = n MOD 10', title: 'Cut Digit', detail: 'We cut the last digit off. If n is 123, we take 3.' },
  { text: '  rev = (rev * 10) + rem', title: 'Add to Basket', detail: 'We move basket numbers left and glue the new piece on.' },
  { text: '  n = n \\ 10', title: 'Shrink n', detail: 'We throw away the digit we used. n becomes smaller now.' },
  { text: 'WEND', title: 'Go Up', detail: 'The computer goes back up to check n again.' },
  { text: 'PRINT rev', title: 'Final Answer', detail: 'Look! The flipped number is ready on the screen.' },
  { text: 'END', title: 'The End', detail: 'The program is finished. You are a coder now!' }
];

export default function App() {
  // --- States ---
  const [n, setN] = useState(123);
  const [inputVal, setInputVal] = useState(123);
  const [rem, setRem] = useState(0);
  const [rev, setRev] = useState(0);
  const [currentLine, setCurrentLine] = useState(-1);
  const [status, setStatus] = useState('idle'); // idle, running, finished
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [highlightVar, setHighlightVar] = useState(null);
  
  // History stack for the "Previous" button functionality
  const [stepHistoryStack, setStepHistoryStack] = useState([]);
  
  // Local records to show solving history in the current session
  const [recordHistory, setRecordHistory] = useState([]);

  // --- Logic Step Functions ---
  const stepForward = useCallback(() => {
    // Save current state before moving forward
    setStepHistoryStack(prev => [...prev, { n, rev, rem, currentLine, highlightVar }]);

    let next = currentLine + 1;
    // Logic jump for the WHILE loop (n > 0 is our easy way)
    if (currentLine === 3 && n === 0) next = 8;
    if (currentLine === 7) next = 3;

    if (next >= CODE_STEPS.length) {
      handleComplete();
      return;
    }

    setCurrentLine(next);
    
    // Process variable updates based on line index
    switch (next) {
      case 1: setN(inputVal); setHighlightVar('n'); break;
      case 2: setRev(0); setHighlightVar('rev'); break;
      case 4: setRem(n % 10); setHighlightVar('rem'); break;
      case 5: setRev(prev => (prev * 10) + (n % 10)); setHighlightVar('rev'); break;
      case 6: setN(prev => Math.floor(prev / 10)); setHighlightVar('n'); break;
      default: setHighlightVar(null); break;
    }
  }, [currentLine, n, inputVal, rem, rev, highlightVar]);

  const stepBackward = () => {
    if (stepHistoryStack.length === 0) return;
    const lastState = stepHistoryStack[stepHistoryStack.length - 1];
    setN(lastState.n);
    setRev(lastState.rev);
    setRem(lastState.rem);
    setCurrentLine(lastState.currentLine);
    setHighlightVar(lastState.highlightVar);
    setStepHistoryStack(prev => prev.slice(0, -1));
    setStatus('running');
  };

  const handleComplete = () => {
    setStatus('finished');
    setIsAutoPlaying(false);
    const newEntry = { original: inputVal, reversed: rev, id: Date.now() };
    setRecordHistory(prev => [newEntry, ...prev].slice(0, 5));
  };

  const reset = () => {
    setCurrentLine(-1);
    setN(inputVal);
    setRev(0);
    setRem(0);
    setStepHistoryStack([]);
    setStatus('idle');
    setHighlightVar(null);
    setIsAutoPlaying(false);
  };

  // Handle Auto-play interval
  useEffect(() => {
    let timer;
    if (isAutoPlaying && status !== 'finished') {
      timer = setInterval(stepForward, 1200);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, stepForward, status]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex flex-col selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Smooth Animations only for Code Lines and Numbers */}
      <style>{`
        .code-line-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .number-pop { animation: popScale 0.4s ease-out; }
        @keyframes popScale { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
        
        {/* Header - Simple & Clean */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 p-6 md:p-8  border border-white/5 backdrop-blur-md gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Terminal className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Q Lab</h1>
              <p className="text-[11px] text-sky-400 font-bold uppercase tracking-widest">Reverse number logic</p>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">Made by Sonu</span>
          </div>
        </div>

        {/* Variable Tracker with Names & Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'n', label: 'Variable n', val: n, color: 'sky', icon: Cpu, desc: '(The Main Number)' },
            { id: 'rem', label: 'Variable rem', val: rem, color: 'amber', icon: Zap, desc: '(The Cut Piece)' },
            { id: 'rev', label: 'Variable rev', val: rev, color: 'indigo', icon: Sparkles, desc: '(The Flipped Answer)' }
          ].map((item) => (
            <div 
              key={item.id} 
              className={`p-8 rounded-[2.5rem] border-2 transition-colors duration-500 ${highlightVar === item.id ? `border-${item.color === 'sky' ? 'sky' : item.color === 'amber' ? 'amber' : 'indigo'}-500 bg-${item.color === 'sky' ? 'sky' : item.color === 'amber' ? 'amber' : 'indigo'}-500/10 shadow-2xl scale-100` : 'border-white/5 bg-slate-900/30'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-950 rounded-2xl border border-white/5 text-${item.color === 'sky' ? 'sky' : item.color === 'amber' ? 'amber' : 'indigo'}-400`}>
                  <item.icon size={22} />
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</div>
                   <div className="text-[9px] font-bold text-slate-600 italic uppercase">{item.desc}</div>
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Value</h3>
              <div className={`text-5xl md:text-6xl font-black text-white font-mono mt-1 tracking-tighter ${highlightVar === item.id ? 'number-pop' : ''}`}>
                 {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* Logic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Code Viewer Column */}
          <div className="lg:col-span-4 order-2 lg:order-1 bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-6 shadow-inner">
             <div className="flex items-center gap-3 mb-6 px-2 text-sky-500">
                <Code size={18} />
                <h2 className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Step-by-Step Code</h2>
             </div>
             <div className="space-y-2.5">
                {CODE_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 p-4 rounded-2xl code-line-transition ${currentLine === idx ? 'bg-sky-600 text-white shadow-xl scale-[1.03] translate-x-1' : 'text-slate-500'}`}
                  >
                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-[10px] ${currentLine === idx ? 'bg-white text-sky-600' : 'bg-slate-800'}`}>
                      {idx + 1}
                    </div>
                    <pre className="font-mono text-sm overflow-hidden">{step.text}</pre>
                  </div>
                ))}
             </div>
          </div>

          {/* Explanation Column */}
          
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
            <div className="bg-[#0a0f1a] rounded-[3rem] p-10 md:p-16 text-center space-y-8 flex flex-col items-center border border-white/5 shadow-2xl relative">
                 <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center shadow-inner">
                    <Info className="w-10 h-10 text-sky-400" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                       {currentLine === -1 ? "Ready to begin?" : CODE_STEPS[currentLine]?.title}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                       {currentLine === -1 ? "Enter a number and click 'Next' to start the logic animation!" : CODE_STEPS[currentLine]?.detail}
                    </p>
                 </div>
            </div>

            {/* Controls Center (Triple Button Layout) */}
            <div className="bg-slate-900/50 p-6 md:p-10 rounded-[3.5rem] border border-white/5 flex flex-col items-center gap-8 shadow-xl">
               <div className="w-full">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 ml-6">Input Test Number</label>
                  <input 
                    type="number" 
                    value={inputVal}
                    disabled={status !== 'idle'}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setInputVal(v); if(status==='idle') setN(v); }}
                    className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] px-10 py-6 text-4xl font-black text-white focus:ring-4 focus:ring-sky-500/20 outline-none transition-all disabled:opacity-40" 
                  />
               </div>
               
               <div className="grid grid-cols-3 gap-4 w-full">
                  {/* Previous Step Button */}
                  <button 
                    onClick={stepBackward}
                    disabled={stepHistoryStack.length === 0 || isAutoPlaying}
                    className="h-20 md:h-24 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-400 rounded-3xl font-black text-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border border-white/5 shadow-lg"
                    title="Previous Step"
                  >
                    <ChevronLeft size={28} />
                    <span className="text-[9px] uppercase tracking-tighter">Previous</span>
                  </button>
                  
                  {/* Auto Play/Pause Button */}
                  <button 
                    onClick={() => { setStatus('running'); setIsAutoPlaying(!isAutoPlaying); }}
                    className={`h-20 md:h-24 rounded-3xl font-black text-xl flex flex-col items-center justify-center gap-1 transition-all border-4 ${isAutoPlaying ? 'bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'}`}
                    title="Auto Play/Pause"
                  >
                    {isAutoPlaying ? <Pause size={28} /> : <Play size={28} />}
                    <span className="text-[9px] uppercase tracking-tighter">{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
                  </button>
                  
                  {/* Next Step/Reset Button */}
                  <button 
                    onClick={() => { if(status==='finished') reset(); else { setStatus('running'); stepForward(); } }}
                    disabled={isAutoPlaying}
                    className="h-20 md:h-24 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white rounded-3xl font-black text-xl flex flex-col items-center justify-center gap-1 shadow-xl shadow-sky-600/30 transition-all active:scale-95"
                    title="Next Step"
                  >
                    {status === 'finished' ? <RotateCcw size={28} /> : <ChevronRight size={36} />}
                    <span className="text-[9px] uppercase tracking-tighter">{status === 'finished' ? 'Reset' : 'Next Step'}</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Personal Progress History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="font-black text-xs uppercase text-slate-500 mb-8 flex items-center gap-3 tracking-widest">
                 <Trophy className="text-amber-500 w-5 h-5" /> Quick Achievements
              </h4>
              <div className="space-y-3">
                 <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <span className="text-sm font-bold text-slate-400">Learned MOD operator logic</span>
                 </div>
                 <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 opacity-50">
                    <CheckCircle2 className="text-slate-600 shrink-0" size={20} />
                    <span className="text-sm font-bold text-slate-500">Reverse any 5-digit number</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="font-black text-xs uppercase text-slate-500 mb-8 flex items-center gap-3 tracking-widest">
                 <HistoryIcon className="text-indigo-400 w-5 h-5" /> Your Session Solves
              </h4>
              <div className="space-y-4">
                 {recordHistory.length === 0 ? (
                   <div className="py-8 text-center text-slate-600 italic font-medium">No history found. Start your first solve!</div>
                 ) : (
                   recordHistory.map(h => (
                     <div key={h.id} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group">
                        <span className="font-black text-slate-300 text-lg uppercase tracking-tight">n: {h.original}</span>
                        <ArrowRight size={16} className="text-sky-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-indigo-400 font-black text-xl italic tracking-tighter">rev: {h.reversed}</span>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Simplified Pro Footer */}
      <footer className="w-full py-20 px-4 bg-black border-t border-white/5 flex flex-col items-center gap-12 text-center">

         
         {/* Social Links Section */}
         <div className="flex flex-wrap justify-center gap-6">
            <a 
               href="https://instagram.com/sonu.singhh7" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-5 rounded-[2.5rem] transition-all group shadow-lg active:scale-95"
            >
               <Instagram size={22} className="text-white" />
               <span className="text-white font-bold tracking-tight text-lg">sonu.singhh7</span>
            </a>

            <a 
               href="https://github.com/sonusinghh7" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-5 rounded-[2.5rem] transition-all group shadow-lg active:scale-95"
            >
               <Github size={22} className="text-white" />
               <span className="text-white font-bold tracking-tight text-lg">sonusinghh7</span>
            </a>

            <a 
               href="https://linkedin.com/in/sonusinghh7" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-5 rounded-[2.5rem] transition-all group shadow-lg active:scale-95"
            >
               <Linkedin size={22} className="text-white" />
               <span className="text-white font-bold tracking-tight text-lg">sonusinghh7</span>
            </a>
         </div>

         
      </footer>
    </div>
  );
}