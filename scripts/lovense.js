const https = require('https');

const API_URL = process.env.SIGNAL_API_URL || 'https://localhost:30010/command';

function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(command);
    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-platform': 'signal',
      },
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const action = process.argv[2];

  switch (action) {
    case 'status':
    case 'toys': {
      const res = await sendCommand({ command: 'GetToys' });
      console.log(JSON.stringify(res, null, 2));
      break;
    }
    case 'connected': {
      const res1 = await sendCommand({ command: 'GetToyName' });
      console.log(JSON.stringify(res1, null, 2));
      break;
    }
    case 'vibrate': {
      const strength = parseInt(process.argv[3]) || 10;
      const timeSec = parseInt(process.argv[4]) || 0;
      const cmd = {
        command: 'Function',
        action: `Vibrate:${strength}`,
        apiVer: 1,
      };
      if (timeSec > 0) cmd.timeSec = timeSec;
      const res2 = await sendCommand(cmd);
      console.log(JSON.stringify(res2, null, 2));
      break;
    }
    case 'pattern': {
      // pattern <timeSec> <strengths...>
      // e.g. pattern 10 20 5 15 20 0 10
      const patternTime = parseInt(process.argv[3]) || 0;
      const strengths = process.argv.slice(4).join(';') || '5;10;15;20;15;10;5';
      const res4 = await sendCommand({
        command: 'Pattern',
        rule: 'V:1;F:v;S:1000#',
        strength: strengths,
        timeSec: patternTime,
        apiVer: 2,
      });
      console.log(JSON.stringify(res4, null, 2));
      break;
    }
    case 'wave': {
      // gentle wave pattern, 20 seconds
      const waveTime = parseInt(process.argv[3]) || 20;
      const res5 = await sendCommand({
        command: 'Pattern',
        rule: 'V:1;F:v;S:500#',
        strength: '3;6;10;14;18;20;18;14;10;6;3;0',
        timeSec: waveTime,
        apiVer: 2,
      });
      console.log(JSON.stringify(res5, null, 2));
      break;
    }
    case 'pulse': {
      // pulse [seconds] [max] [min]
      const pulseTime = parseInt(process.argv[3]) || 20;
      const pulseMax = parseInt(process.argv[4]) || 20;
      const pulseMin = parseInt(process.argv[5]) || 0;
      const res6 = await sendCommand({
        command: 'Pattern',
        rule: 'V:1;F:v;S:300#',
        strength: `${pulseMax};${pulseMin};${pulseMax};${pulseMin};${pulseMax};${pulseMin}`,
        timeSec: pulseTime,
        apiVer: 2,
      });
      console.log(JSON.stringify(res6, null, 2));
      break;
    }
    case 'stop': {
      const res3 = await sendCommand({
        command: 'Function',
        action: 'Vibrate:0',
        apiVer: 1,
      });
      console.log(JSON.stringify(res3, null, 2));
      break;
    }
    default:
      console.log('Usage: lovense.js <command> [args]');
      console.log('  toys/status      - Get all linked toys');
      console.log('  connected        - Get connected toys');
      console.log('  vibrate [1-20] [seconds] - Vibrate all toys');
      console.log('  stop             - Stop all toys');
      break;
  }
}

main().catch(console.error);
