const fs = require('fs');
const path = require('path');

function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(path.join(__dirname, 'files'), (err, fileList) =>
    fileList.forEach((fileName) =>
      fs.copyFile(
        path.join(__dirname, 'files', fileName),
        path.join(__dirname, 'files-copy', fileName),
        (err) => {
          if (err) throw err;
        },
      ),
    ),
  );
}

copyDir();
