const { exec } = require('shelljs');

module.exports = {
  buildCommand: () => 'yarn build',
  pullRequestTeamReviewers: ['events-platform'],
  publishCommand: ({ dir }) => {
    // update metadata.yaml by executing external script instead of inline because
    // the esm module loader being used by Ship.js is incompatible with the YAML package
    const version = require(`${dir}/package.json`).version;
    exec(`node scripts/update-metadata.js ${version}`);
    return `git commit -am "chore: update metadata.yml"`;
  },
};
