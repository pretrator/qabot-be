const axios = require('axios');
let data = JSON.stringify({
  "conversationId": "a91fc5e96a3eb8e817001fa5c0959d50",
  "query": "on what day does the office of logan kuo opens"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:3001/conversation/query',
  responseType: 'stream',
  headers: { 
    'Accept': '*/*', 
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8', 
    'Cache-Control': 'no-cache', 
    'Connection': 'keep-alive', 
    'DNT': '1', 
    'Origin': 'https://wishlink.dev', 
    'Pragma': 'no-cache', 
    'Referer': 'https://wishlink.dev/', 
    'Sec-Fetch-Dest': 'empty', 
    'Sec-Fetch-Mode': 'cors', 
    'Sec-Fetch-Site': 'same-site', 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"macOS"', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then(function (response) {
    // Handle streaming response
    // Optionally, listen for events on the response stream
    response.data.on('data', (chunk) => {
      console.log('Received chunk of data:', chunk.toString());
    });

    response.data.on('end', () => {
      console.log('Streaming response ended');
    });
  })
.catch((error) => {
  console.log(error);
});
