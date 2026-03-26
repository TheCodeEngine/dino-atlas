/**
 * Skelett-Puzzle
 * - Knochen-Teile am Rand durcheinander
 * - Kind zieht Teile an die richtige Stelle (Drag & Drop)
 * - Snap-to-Position wenn nah genug
 * - Optionaler Umriss als Hilfe (Schwierigkeit)
 * - Fertig: Skelett "erwacht zum Leben" Animation
 * - Weiter zum Erkennen-Screen
 */
export function PuzzleScreen() {
  return (
    <div className="bg-[#2C1A0E] text-white min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundImage: "none" }}>
      <div className="w-full max-w-sm text-center">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#ffc850]/80 mb-2">Oskar's Expedition</p>
        <h1 className="text-xl font-black uppercase tracking-tight mb-6">Skelett zusammensetzen!</h1>

        {/* Puzzle area placeholder */}
        <div className="aspect-square bg-[#3a2510] rounded-xl border-[3px] border-[#5a3a1a] mb-4 flex items-center justify-center">
          <div className="text-center text-[#ffc850]/50">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: "48px" }}>extension</span>
            <p className="text-sm font-bold">Drag & Drop Puzzle</p>
            <p className="text-xs mt-1 opacity-60">Knochen an die richtige Stelle ziehen</p>
          </div>
        </div>

        <p className="text-xs text-white/50">4 von 6 Teilen platziert</p>
        <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-[#84c75d] to-[#ffc850] rounded-full" />
        </div>
      </div>
    </div>
  );
}
