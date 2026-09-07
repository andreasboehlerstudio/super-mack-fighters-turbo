declare const __GAME_BUILD__:{version:string;revision:string;dirty:boolean};
export function BuildStamp(){
 const build=typeof __GAME_BUILD__==='undefined'?{version:'0.2.0-alpha',revision:'local',dirty:true}:__GAME_BUILD__;
 return <a className="game-build-stamp" href="https://github.com/andreasboehlerstudio/super-mack-fighters-turbo/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer" aria-label={`Alpha ${build.version}, Stand ${build.revision}. Changelog auf GitHub öffnen.`}>ALPHA {build.version.replace('-alpha','')} · {build.revision}{build.dirty?' · DEV':''}</a>;
}
