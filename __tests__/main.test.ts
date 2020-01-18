import * as main from '../src/main';
import * as io from '@actions/io';
import path from 'path';
import nock from 'nock';
// import {FetchError} from 'node-fetch';
import jsonTestBrew from './data/brew.json';
// import jsonTestGithub from './data/github.json';

jest.setTimeout(30000);
const repo = 'hugo';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_HUGO-VERSION'];
  nock.cleanAll();
});

describe('Integration testing run()', () => {
  afterEach(async () => {
    await io.rmRF(path.join(`${process.env.HOME}`, 'tmp'));
  });

  test('succeed in installing a custom version', async () => {
    const testVersion = '0.61.0';
    process.env['INPUT_HUGO-VERSION'] = testVersion;
    const result: main.ActionResult = await main.run();
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(`Hugo Static Site Generator v${testVersion}`);
  });

  test('succeed in installing the latest version', async () => {
    const testVersion = 'latest';
    process.env['INPUT_HUGO-VERSION'] = testVersion;
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(200, jsonTestBrew);
    const result: main.ActionResult = await main.run();
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch('Hugo Static Site Generator v0.62.2');
  });
});

describe('showVersion()', () => {
  let result: main.ActionResult = {
    exitcode: 0,
    output: ''
  };

  test('return version', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('return not found', async () => {
    result = await main.showVersion('gitgit', ['--version']);
    expect(result.exitcode).not.toBe(0);
  });
});
