import assert from'node:assert/strict';
import{createServer}from'node:http';
import{waitForDeployment}from'./wait-for-deployment.mjs';

const expected='a'.repeat(40),stale='b'.repeat(40);
let attempts=0;
const server=createServer((_request,response)=>{
 attempts++;
 response.writeHead(200,{'Content-Type':'text/plain','Cache-Control':'no-store'});
 response.end(`${attempts>1?expected:stale}\n`);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
assert.ok(address&&typeof address==='object');
const baseUrl=`http://127.0.0.1:${address.port}`;

try{
 await waitForDeployment({baseUrl,expectedCommit:expected,timeoutMs:500,intervalMs:10});
 assert.ok(attempts>=2,'readiness check must reject a stale deployment before accepting the exact commit');
 attempts=0;
 await assert.rejects(
  waitForDeployment({baseUrl,expectedCommit:'c'.repeat(40),timeoutMs:40,intervalMs:10}),
  /Production did not reach/
 );
}finally{
 await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
}

console.log('Exact production deployment readiness checks passed.');
