import * as core from '@actions/core';
import * as main from './main';

(async (): Promise<void> => {
  try {
    await main.run();
  } catch (e) {
    // eslint-ignore-next-line
    core.setFailed(`Action failed with error ${e.message}`);
  }
})();
