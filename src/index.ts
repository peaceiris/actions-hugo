import * as core from '@actions/core';
import * as main from './main';

(async () => {
  try {
    await main.run();
  } catch (e) {
    core.setFailed(`Action failed with error ${e}`);
  }
})();
