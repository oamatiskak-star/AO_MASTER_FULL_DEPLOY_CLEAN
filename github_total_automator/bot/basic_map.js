const fs=require('fs');const path=require('path');const out='structured';
if(!fs.existsSync(out))fs.mkdirSync(out);
function ensure(d){if(!fs.existsSync(d))fs.mkdirSync(d);}
const groups={frontend:['page','component','layout'],backend:['server','route','controller'],executor:['executor'],database:['.sql'],workflows:['workflow','vercel','render'],design:['css','theme']};
Object.keys(groups).forEach(g=>ensure(path.join(out,g)));
function walk(d){
  fs.readdirSync(d).forEach(f=>{
    const full=path.join(d,f);
    const s=fs.statSync(full);
    if(s.isDirectory())walk(full);
    else{
      const lower=full.toLowerCase();
      let g=null;
      for(const k in groups){
        if(groups[k].some(x=>lower.includes(x))){g=k;break;}
      }
      if(g){
        const dest=path.join(out,g,path.basename(full));
        fs.copyFileSync(full,dest);
      }
    }
  });
}
walk('.');
console.log('Basic mapping done');