import test from 'node:test';
import assert from 'node:assert/strict';
import {onlineError} from './online-error.ts';
void test('online errors keep useful invitation messages but do not expose server pages',()=>{
 assert.equal(onlineError(404,'Einladung abgelaufen'),'Einladung abgelaufen');
 assert.equal(onlineError(409,'Dieser Kampf ist bereits belegt'),'Dieser Kampf ist bereits belegt');
 assert.match(onlineError(500,'<!doctype html><script>private stack trace</script>'),/nicht erreichbar/);
 assert.doesNotMatch(onlineError(403,'<html>Access denied</html>'),/html/);
 assert.ok(onlineError(400,'x'.repeat(4000)).length<240);
});
