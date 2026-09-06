import test from 'node:test';
import assert from 'node:assert/strict';
import {NetworkSession,packInput,unpackInput} from './network.ts';
import {neutral} from './combat.ts';
class Channel extends EventTarget{readyState='open';other!:Channel;send(data:string){this.other.dispatchEvent(new MessageEvent('message',{data}))}close(){this.readyState='closed'}}
const pair=()=>{const a=new Channel(),b=new Channel();a.other=b;b.other=a;const peer={close(){}} as RTCPeerConnection;return [new NetworkSession(peer,a as unknown as RTCDataChannel,0),new NetworkSession(peer,b as unknown as RTCDataChannel,1)] as const};
test('online input encoding preserves every combination of movement and actions',()=>{for(let bits=0;bits<1024;bits++)assert.equal(packInput(unpackInput(bits)),bits)});
test('online peers keep the same input order and resume after either player pauses',()=>{
 const [a,b]=pair();assert.equal(a.inputs(neutral),null);a.ready();b.ready();
 for(let n=0;n<12;n++){const i=a.inputs(()=>({...neutral(),right:true})),j=b.inputs(()=>({...neutral(),punch:true}));assert.deepEqual(i,j);if(n>=4){assert.equal(i?.[0].right,true);assert.equal(i?.[1].punch,true)}}
 b.pause(true);assert.equal(a.inputs(neutral),null);assert.equal(b.inputs(neutral),null);a.pause(true);b.pause(false);assert.equal(a.inputs(neutral),null);a.pause(false);assert.deepEqual(a.inputs(neutral),b.inputs(neutral));a.destroy();b.destroy();
});
test('a peer that never loads the arena gives a recoverable error',()=>{const [a,b]=pair();a.ready();a.lastMessage=Date.now()-46000;assert.equal(a.inputs(neutral),null);assert.match(a.error,/Arena nicht laden/);a.destroy();b.destroy()});
