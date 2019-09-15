const core = require('@actions/core');
// const wait = require('./wait');

let hugoVersion = '';

// most @actions toolkit packages have async methods
async function run() {
  try {
    // const ms = core.getInput('milliseconds');
    // console.log(`Waiting ${ms} milliseconds ...`)

    // core.debug((new Date()).toTimeString())
    // wait(parseInt(ms));
    // core.debug((new Date()).toTimeString())

    // core.setOutput('time', new Date().toTimeString());

    hugoVersion = core.getInput('hugo-version');
    if (!hugoVersion) {
      hugoVersion = 'latest';
    }
    console.log('Hugo version:', hugoVersion);

    const extended = core.getInput('extended');
    console.log('Hugo extended:', extended);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
