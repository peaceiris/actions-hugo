import * as main from '../src/main';
const nock = require('nock');
// import {FetchError} from 'node-fetch';
import jsonTestBrew from './data/brew.json';
// import jsonTestGithub from './data/github.json';

jest.setTimeout(30000);
const repo: string = 'hugo';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_HUGO-VERSION'];
  nock.cleanAll();
});

describe('Integration testing run()', () => {
  test('succeed in installing a custom version', async () => {
    const testVersion: string = '0.61.0';
    process.env['INPUT_HUGO-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(`Hugo Static Site Generator v${testVersion}`);
  });

  test('succeed in installing the latest version', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_HUGO-VERSION'] = testVersion;
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(200, jsonTestBrew);
    const result: main.actionResult = await main.run();
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch('Hugo Static Site Generator v0.62.2');
  });
});

describe('showVersion()', () => {
  let result: main.actionResult = {
    exitcode: 0,
    output: ''
  };

  test('return version', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('return exception', async () => {
    try {
      result = await main.showVersion('gitgit', ['--version']);
    } catch (e) {
      expect(e).toThrow(Error);
    }
  });
});
