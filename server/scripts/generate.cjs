const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// sequelize-cli writes .js files, but this package is "type": "module",
// so the generated files are renamed to .cjs to match the existing ones.
const [kind, name] = process.argv.slice(2);
const generators = {
  migration: { command: 'migration:generate', dir: 'migrations' },
  seed: { command: 'seed:generate', dir: 'seeders' },
};

if (!generators[kind] || !name) {
  console.error('Usage: npm run migration -- <name>  |  npm run seed -- <name>');
  process.exit(1);
}

const { command, dir } = generators[kind];
const folder = path.resolve(dir);
const before = new Set(fs.readdirSync(folder));

execSync(`npx sequelize-cli ${command} --name ${name}`, { stdio: 'inherit' });

for (const file of fs.readdirSync(folder)) {
  if (!before.has(file) && file.endsWith('.js')) {
    fs.renameSync(path.join(folder, file), path.join(folder, file.replace(/\.js$/, '.cjs')));
  }
}
