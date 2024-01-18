const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) =>
  files.forEach((fileName) => {
    const filePath = path.join(__dirname, 'secret-folder', fileName);
    fs.stat(filePath, (errSt, fileStats) => {
      if (fileStats.isFile()) {
        console.log(
          [
            path.parse(filePath).name,
            path.parse(filePath).ext.slice(1),
            fileStats.size / 1000,
          ].join(' - '),
          'Kb',
        );
      }
    });
  }),
);
