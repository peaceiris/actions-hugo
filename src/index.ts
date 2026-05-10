import * as core from '@actions/core';
import * as main from './main';

(async (): Promise<void> => {
  try {
    await main.run();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    core.setFailed(`Action failed with error ${message}`);
  }
})();
