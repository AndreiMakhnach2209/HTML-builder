const fs = require('fs');
const path = require('path');

function mergeStyles(pathDistStyles) {
  const stylesDir = path.join(__dirname, 'styles');
  const distPath = path.join(pathDistStyles, 'style.css');
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
}

function copyDir(pathOriginalDir, pathToCopy) {
  fs.readdir(pathOriginalDir, (err, fileList) =>
    fileList.forEach((fileName) => {
      fs.stat(path.join(pathOriginalDir, fileName), (err, fileStats) => {
        if (fileStats.isDirectory()) {
          fs.mkdir(
            path.join(pathToCopy, fileName),
            { recursive: true },
            (err) => {
              if (err) throw err;
            },
          );
          copyDir(
            path.join(pathOriginalDir, fileName),
            path.join(pathToCopy, fileName),
          );
        } else {
          fs.copyFile(
            path.join(pathOriginalDir, fileName),
            path.join(pathToCopy, fileName),
            (err) => {
              if (err) throw err;
            },
          );
        }
      });
    }),
  );
}

function replaceTempTags(patchDistDir) {
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'));
  let data = '';
  readStream.on('data', (chunk) => (data += chunk));
  readStream.on('end', () => {
    const tempTags = data
      .match(/\{\{\w+\}\}/g)
      .map((item) => item.match(/\w/g).join(''));
    tempTags.forEach((tagName) => {
      const pathComponent = path.join(
        __dirname,
        'components',
        tagName + '.html',
      );
      fs.access(pathComponent, (error) => {
        if (error) console.log(`Component {{${tagName}}} not found`);
        else {
          let component = '';
          const readComponent = fs.createReadStream(pathComponent);
          const writeComponent = fs.createWriteStream(
            path.join(patchDistDir, 'index.html'),
          );
          readComponent.on('data', (chunk) => (component += chunk));
          readComponent.on('end', () => {
            const regExp = new RegExp(`{{${tagName}}}`);
            data = data.replace(regExp, `\n${component}\n`);
            writeComponent.write(data);
          });
        }
      });
    });
  });
}

const pathAssets = path.join(__dirname, 'assets');
const pathDist = path.join(__dirname, 'project-dist');
const pathDistAssets = path.join(pathDist, 'assets');

fs.access(pathDistAssets, (error) => {
  if (error) {
    fs.mkdir(path.join(pathDistAssets), { recursive: true }, (err) => {
      if (err) throw err;
      else {
        copyDir(pathAssets, pathDistAssets);
        replaceTempTags(pathDist);
        mergeStyles(pathDist);
      }
    });
  } else {
    fs.rm(pathDistAssets, { recursive: true }, (err) => {
      if (err) throw err;
      else {
        fs.mkdir(path.join(pathDistAssets), { recursive: true }, (err) => {
          if (err) throw err;
          else {
            copyDir(pathAssets, pathDistAssets);
            replaceTempTags(pathDist);
            mergeStyles(pathDist);
          }
        });
      }
    });
  }
});
