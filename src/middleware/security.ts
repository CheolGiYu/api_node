const cors = require('cors');
const uuidAPIKey = require('uuid-apikey');
const {apikey} = require('../api/key');

let whitelist: string[] = [];
for(let i in apikey){
	whitelist.push(apikey[i]['host']);
}

const corsOptions = {
  Origin: function (origin: string, callback: any) { 
    if (whitelist.indexOf(origin) !== -1) { // 만일 whitelist 배열에 origin인자가 있을 경우
      // callback(null, true); // cors 허용
    } else {
      callback(new Error("Not Allowed Origin!")); // cors 비허용
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

type header = {
    origin: string;
    'content-type': string;
}
const authority = (method: any, header: header) => {
  const origin = header.origin;
  const {key} = method;
  let authority = false;
  for(let i in apikey){
      if (header['content-type'].includes('multipart/form-data;')) {
        if(origin !== apikey[i].host) authority = authority;
        else authority = true;
      }else{
        if(!uuidAPIKey.isAPIKey(key) || !uuidAPIKey.check(key, apikey[i].uuid) || origin !== apikey[i].host) authority = authority;
        else authority = true;
      }
  }
  if(!authority) return 404;
  else return 200;
};

const applyCors = cors(corsOptions);

module.exports = {
  authority: authority,
  applyCors: applyCors
};