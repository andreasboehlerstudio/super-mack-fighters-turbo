import type {CSSProperties, ReactNode} from 'react';
import {HEROES, fighter, type FighterId} from './data';
import {FighterPortrait} from './FighterPortrait';
import {MoveList} from './MoveList';
import {SELECT_COLUMNS} from './select-layout';
import type {GameMode} from './match-setup';
import type {GameRules} from './rules';

type Props = {
 mode: GameMode; p1: FighterId; p2: FighterId; picking: number; rules: GameRules;
 onPickSeat: (seat: number) => void; onSelect: (id: FighterId) => void;
 onToggleTag: () => void; children: ReactNode;
};

function PortraitPanel({id, label, active, player, side=player, showMoves}: {
 id: FighterId; label: string; active: boolean; player: number; side?: number; showMoves: boolean;
}) {
 const hero = fighter(id);
 return <aside className={`select-hero ${active ? 'is-active' : ''} side-${side}`} style={{'--hero-color':hero.color} as CSSProperties}>
  <div className="select-hero-label">{label}<span>{active ? 'WÄHLT' : 'BEREIT'}</span></div>
  <div className="select-hero-art"><FighterPortrait id={id}/></div>
  <h2>{hero.name}</h2>
  {showMoves ? <MoveList id={id} player={player}/> : <><strong className="select-hero-tag">{hero.tag}</strong><p className="select-hero-note">{hero.note}</p></>}
 </aside>;
}

export function PlayerSelect({mode,p1,p2,picking,rules,onPickSeat,onSelect,onToggleTag,children}:Props) {
 const solo = mode === 'arcade';
 const opponent = mode === 'versus' ? '2P' : 'CPU';
 const selectedId = picking === 0 ? p1 : picking === 1 ? p2 : picking === 2 ? rules.partner1 : rules.partner2;
 const leftId = picking === 2 ? rules.partner1 : p1;
 const rightId = picking === 3 ? rules.partner2 : p2;
 const seats = [{slot:0,id:p1,label:'1P'}, ...(rules.tag ? [{slot:2,id:rules.partner1,label:'1P PARTNER'}] : []),
  ...(!solo ? [{slot:1,id:p2,label:opponent}, ...(rules.tag ? [{slot:3,id:rules.partner2,label:opponent+' PARTNER'}] : [])] : [])];
 const selectedSeat = seats.find(seat => seat.slot === picking)!;
 return <section className="player-select" aria-label="Charakterauswahl">
  <header className="select-heading"><h1>PLAYER SELECT</h1><span>{solo ? 'ARCADE' : mode === 'training' ? 'TRAINING' : 'VERSUS'}</span></header>
  <div className="select-stage">
   <PortraitPanel id={leftId} label={picking === 2 ? '1P · PARTNER' : 'PLAYER 1'} active={picking === 0 || picking === 2} player={0} showMoves={!solo}/>
   <div className="select-roster">
    <div className="select-roster-caption" aria-live="polite"><strong>{selectedSeat?.label} WÄHLT</strong><span>{rules.tag ? 'TAG-TEAM' : '1 GEGEN 1'}</span></div>
    <div className="select-grid" style={{'--select-columns':SELECT_COLUMNS} as CSSProperties} aria-label="Figurenauswahl">
     {HEROES.map(hero => {
      const badges = seats.filter(seat => seat.id === hero.id);
      return <button key={hero.id} aria-label={`${hero.name} auswählen`} aria-pressed={hero.id === selectedId}
       className={`select-tile ${hero.id === selectedId ? 'is-current' : ''} ${badges.some(seat => seat.slot === 0 || seat.slot === 2) ? 'has-p1' : ''} ${badges.some(seat => seat.slot === 1 || seat.slot === 3) ? 'has-p2' : ''}`}
       onClick={() => onSelect(hero.id)}>
       <FighterPortrait id={hero.id}/>
       <span className="select-tile-badges">{badges.map(seat => <b key={seat.slot} className={seat.slot === 1 || seat.slot === 3 ? 'badge-p2' : ''}>{seat.slot > 1 ? (seat.slot === 2 ? '1P+' : opponent+'+') : seat.label}</b>)}</span>
       <span className="select-tile-name">{hero.short}</span>
      </button>;
     })}
    </div>
    <div className="select-seats">
     {seats.map(seat => <button key={seat.slot} className={picking === seat.slot ? 'is-current' : ''} aria-pressed={picking === seat.slot}
      onClick={() => onPickSeat(seat.slot)}><small>{seat.label}</small><strong>{fighter(seat.id).short}</strong></button>)}
     <button className="select-tag-toggle" aria-pressed={rules.tag} onClick={onToggleTag}>TAG-TEAM<br/>{rules.tag ? 'AN' : 'AUS'}</button>
    </div>
    <p className="select-input-hint">← ↑ ↓ → WÄHLEN <span>ENTER / A BESTÄTIGEN</span></p>
   </div>
   {solo ? <aside className="select-moves"><div className="select-hero-label">SPECIAL MOVES</div><h2>{fighter(selectedId).short}</h2><MoveList id={selectedId}/><p>↓ ↘ → Viertelkreis<br/>← halten, → Charge</p>{rules.tag && <p className="select-tag-hint">E / LT<br/>PARTNER WECHSELN</p>}</aside> :
    <PortraitPanel id={rightId} label={picking === 3 ? opponent+' · PARTNER' : mode === 'versus' ? 'PLAYER 2' : 'COMPUTER'} active={picking === 1 || picking === 3} player={mode === 'versus' ? 1 : 0} side={1} showMoves/>}
  </div>
  <div className="select-settings">{children}</div>
 </section>;
}
