const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write(
  '<<< Hi! Write me something here, and I`ll write it to a file. >>>\n',
);
stdin.on('data', (data) => {
  if (data.toString() === 'exit\n') process.exit();
  else writeStream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\n<<< Good Buy!!! >>>\n'));
