import * as core from '@actions/core';
import * as main from './main';

try {
  main.run();
} catch (e) {
  core.setFailed(`Action failed with error ${e}`);
}
