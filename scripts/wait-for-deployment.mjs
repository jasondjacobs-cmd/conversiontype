import{pathToFileURL}from'node:url';

const shaPattern=/^[0-9a-f]{40}$/i;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

export async function waitForDeployment({baseUrl,expectedCommit,timeoutMs=240000,intervalMs=5000,fetchImpl=fetch,sleep=delay}){
 if(!shaPattern.test(expectedCommit))throw Error('Expected commit must be a 40-character Git SHA');
 const endpoint=new URL('/_meta/commit.txt',baseUrl.endsWith('/')?baseUrl:`${baseUrl}/`);
 endpoint.searchParams.set('expected',expectedCommit);
 const deadline=Date.now()+timeoutMs;
 let lastSeen='unavailable';
 do{
  try{
   const response=await fetchImpl(endpoint,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
   lastSeen=response.ok?(await response.text()).trim():`HTTP ${response.status}`;
   if(lastSeen===expectedCommit){console.log(`Production is serving ${expectedCommit}`);return}
  }catch(error){lastSeen=error instanceof Error?error.message:String(error)}
  if(Date.now()>=deadline)break;
  console.log(`Waiting for ${expectedCommit}; currently ${lastSeen}`);
  await sleep(intervalMs);
 }while(Date.now()<deadline);
 throw Error(`Production did not reach ${expectedCommit} within ${timeoutMs}ms; last response: ${lastSeen}`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const[, ,baseUrl,expectedCommit]=process.argv;
 await waitForDeployment({baseUrl,expectedCommit});
}
