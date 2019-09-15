const core = require('@actions/core');
// const wait = require('./wait');

let hugoVersion = '';
let extended = '';

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

    extended = core.getInput('extended');
    if (!extended) {
      extended = false;
    }
    console.log('Hugo extended:', extended);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
