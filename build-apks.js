const fs = require('fs');
const path = require('path');
const https = require('https');

const APPS = [
  {
    name: 'TaskFlow-Admin',
    manifestUrl: 'https://troyz-solutions.web.app/Work%20Assigning%20Pannel/manifest.json',
    appUrl: 'https://troyz-solutions.web.app/Work%20Assigning%20Pannel/',
    packageId: 'com.troyzsolutions.taskflow.admin',
    appName: 'TaskFlow Admin'
  },
  {
    name: 'TaskFlow-Worker',
    manifestUrl: 'https://troyz-solutions.web.app/Working%20Panel/manifest.json',
    appUrl: 'https://troyz-solutions.web.app/Working%20Panel/',
    packageId: 'com.troyzsolutions.taskflow.worker',
    appName: 'TaskFlow Worker'
  }
];

async function generateApk(appConfig) {
  console.log(`🚀 Requesting APK for ${appConfig.appName}...`);
  const postData = JSON.stringify({
    manifestUrl: appConfig.manifestUrl,
    appUrl: appConfig.appUrl,
    packageId: appConfig.packageId,
    appName: appConfig.appName,
    enableNotifications: true,
    fallbackType: "customtabs"
  });

  const options = {
    hostname: 'pwabuilder-cloudapk.azurewebsites.net',
    port: 443,
    path: '/api/apk/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Response status for ${appConfig.name}: ${res.statusCode}`);
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (res.statusCode === 200) {
          const outDir = path.join(__dirname, 'mobile-apks');
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          const outPath = path.join(outDir, `${appConfig.name}-builder.zip`);
          fs.writeFileSync(outPath, buffer);
          console.log(`✅ ${appConfig.appName} APK bundle saved to: ${outPath}`);
          resolve(outPath);
        } else {
          console.error(`Failed to generate APK for ${appConfig.appName}:`, buffer.toString());
          resolve(null);
        }
      });
    });
    req.on('error', (e) => {
      console.error(`HTTP error for ${appConfig.name}:`, e.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const app of APPS) {
    await generateApk(app);
  }
}

run();
