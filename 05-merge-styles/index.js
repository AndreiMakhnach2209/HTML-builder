const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = fs.createWriteStream(distPath);

fs.readdir(stylesDir, (err, files) => {
  files.forEach((fileName) => {
    const filePath = path.join(stylesDir, fileName);
    fs.stat(filePath, (errStat, fileStats) => {
      if (fileStats.isFile() && path.parse(filePath).ext === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (chunk) => writeStream.write(chunk));
      }
    });
  });
});
