import type {CSSProperties, ReactNode} from 'react';
import {HEROES, fighter, type FighterId} from './data';
import {FighterPortrait} from './FighterPortrait';
import {MoveList} from './MoveList';
import {SELECT_COLUMNS,SELECT_PAGE_SIZE,selectPage,pageTarget} from './select-layout';
import type {GameMode} from './match-setup';
import type {GameRules} from './rules';

type Props = {
 mode: GameMode; p1: FighterId; p2: FighterId; picking: number; rules: GameRules;
 onPickSeat: (seat: number) => void; onSelect: (id: FighterId) => void;
 onToggleTag: () => void; onTempo: () => void; onParry: () => void; onRandomOpponent: () => void; children: ReactNode;
};

function PortraitPanel({id, label, active, player, side=player, showMoves, partner, partnerActive, onPickLead, onPickPartner, onRandom}: {
 id: FighterId; label: string; active: boolean; player: number; side?: number; showMoves: boolean;
 partner?: FighterId; partnerActive?: boolean; onPickLead: () => void; onPickPartner: () => void; onRandom?: () => void;
}) {
 const hero = fighter(partnerActive && partner ? partner : id);
 const teammate = partner ? fighter(partnerActive ? id : partner) : null;
 return <aside className={`select-hero ${active ? 'is-active' : ''} ${partner ? 'has-partner' : ''} side-${side}`} style={{'--hero-color':hero.color} as CSSProperties}>
  <button className="select-hero-label select-lead-choice" onClick={onPickLead} aria-pressed={active && !partnerActive} aria-label={`${label} Hauptfigur wählen`}>{label}<span>{active ? (partnerActive ? 'PARTNER WÄHLT' : 'WÄHLT') : 'BEREIT'}</span></button>
  <div className="select-hero-art"><FighterPortrait id={hero.id}/></div>
  <h2 className={hero.name.length > 18 ? 'long-name' : ''}>{hero.name}</h2>
  {teammate && <button className="select-partner" onClick={partnerActive ? onPickLead : onPickPartner} aria-label={`${label} ${partnerActive ? 'Hauptfigur' : 'Partner'} ${teammate.name} wählen`}>
   <FighterPortrait id={teammate.id}/><span><small>{partnerActive ? 'HAUPTFIGUR' : 'TAG-PARTNER'}</small>{teammate.short}</span><b>↔</b>
  </button>}
  {showMoves ? <MoveList id={hero.id} player={player}/> : <><strong className="select-hero-tag">{hero.tag}</strong><p className="select-hero-note">{hero.note}</p></>}
  {onRandom && <div className="select-random"><button onClick={onRandom}>↻ GEGNER AUSLOSEN</button><p>COMPUTER: selbst wählen</p></div>}
 </aside>;
}

export function PlayerSelect({mode,p1,p2,picking,rules,onPickSeat,onSelect,onToggleTag,onTempo,onParry,onRandomOpponent,children}:Props) {
 const solo = mode === 'arcade';
 const opponent = mode === 'versus' ? '2P' : 'CPU';
 const selectedId = picking === 0 ? p1 : picking === 1 ? p2 : picking === 2 ? rules.partner1 : rules.partner2;
 const seats = [{slot:0,id:p1,label:'1P'}, ...(rules.tag ? [{slot:2,id:rules.partner1,label:'1P PARTNER'}] : []),
  ...(!solo ? [{slot:1,id:p2,label:opponent}, ...(rules.tag ? [{slot:3,id:rules.partner2,label:opponent+' PARTNER'}] : [])] : [])];
 const selectedSeat = seats.find(seat => seat.slot === picking)!;
 const selectedIndex=HEROES.findIndex(hero=>hero.id===selectedId),page=selectPage(selectedIndex),pages=Math.ceil(HEROES.length/SELECT_PAGE_SIZE);
 const visibleHeroes=HEROES.slice(page*SELECT_PAGE_SIZE,(page+1)*SELECT_PAGE_SIZE);
 const turnPage=(direction:number)=>onSelect(HEROES[pageTarget(selectedIndex,direction,HEROES.length)].id);
 return <section className="player-select" aria-label="Charakterauswahl">
  <header className="select-heading"><h1>PLAYER SELECT</h1><div className="select-mode"><button className="select-tag-toggle" onClick={onTempo} aria-label="Kampftempo ändern">TEMPO: {rules.turbo===1?'KLASSISCH':rules.turbo===1.18?'TURBO':'HYPER'}</button><button className="select-tag-toggle" aria-pressed={rules.parry} onClick={onParry}>PARRY {rules.parry?'AN':'AUS'}</button><button className="select-tag-toggle" aria-pressed={rules.tag} onClick={onToggleTag}>TAG-TEAM {rules.tag ? 'AN' : 'AUS'}</button><span>{solo ? 'ARCADE' : mode === 'training' ? 'TRAINING' : 'VERSUS'}</span></div></header>
  <div className="select-stage">
   <PortraitPanel id={p1} label="PLAYER 1" active={picking === 0 || picking === 2} player={0} showMoves={!solo} partner={rules.tag ? rules.partner1 : undefined} partnerActive={picking === 2} onPickLead={() => onPickSeat(0)} onPickPartner={() => onPickSeat(2)}/>
   <div className="select-roster">
    <div className="select-roster-caption" aria-live="polite"><strong>{selectedSeat?.label} WÄHLT</strong>{pages>1 ? <div className="select-pages"><button aria-label="Vorherige Charakterseite" onClick={()=>turnPage(-1)}>◀</button><span>SEITE {page+1}/{pages}</span><button aria-label="Nächste Charakterseite" onClick={()=>turnPage(1)}>▶</button></div> : <span>{rules.tag ? 'TAG-TEAM' : '1 GEGEN 1'}</span>}</div>
    <div className="select-grid" style={{'--select-columns':SELECT_COLUMNS} as CSSProperties} aria-label="Figurenauswahl">
     {visibleHeroes.map(hero => {
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
    <p className="select-input-hint">← ↑ ↓ → WÄHLEN <span>ENTER / A BESTÄTIGEN</span></p>
    {pages>1 && <p className="select-page-hint">BILD ↑ / ↓ · LB / RB · SEITE WECHSELN</p>}
   </div>
   {solo ? <aside className="select-moves"><div className="select-hero-label">SPECIAL MOVES</div><h2>{fighter(selectedId).short}</h2><MoveList id={selectedId}/><p>↓ ↘ → Viertelkreis<br/>← halten, → Charge</p>{rules.tag && <p className="select-tag-hint">E / LT<br/>PARTNER WECHSELN</p>}</aside> :
    <PortraitPanel id={p2} label={mode === 'versus' ? 'PLAYER 2' : 'COMPUTER'} active={picking === 1 || picking === 3} player={mode === 'versus' ? 1 : 0} side={1} showMoves partner={rules.tag ? rules.partner2 : undefined} partnerActive={picking === 3} onPickLead={() => onPickSeat(1)} onPickPartner={() => onPickSeat(3)} onRandom={mode==='cpu'?onRandomOpponent:undefined}/>}
  </div>
  <div className="select-settings">{children}</div>
 </section>;
}
