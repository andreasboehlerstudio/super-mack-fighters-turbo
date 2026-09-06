/** Never render a proxy error page or a server stack trace inside the game. */
export function onlineError(status:number,body:string){
 if(status>=500)return 'Der Online-Dienst ist gerade nicht erreichbar. Bitte erneut versuchen.';
 const message=body.trim();
 if(!message||message.length>240||/[<>]/.test(message))return 'Verbindung fehlgeschlagen. Bitte prüfe den Einladungscode und versuche es erneut.';
 return message;
}
