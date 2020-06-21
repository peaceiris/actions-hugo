import {getURL, getLatestVersion} from '../src/get-latest-version';
import nock from 'nock';
import {FetchError} from 'node-fetch';
import {Tool} from '../src/constants';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  nock.cleanAll();
});

describe('getURL()', () => {
  test('return expected URL', () => {
    const urlBrewExpected = `https://formulae.brew.sh/api/formula/${Tool.Repo}.json`;
    const urlBrew: string = getURL(Tool.Org, Tool.Repo, 'brew');
    expect(urlBrew).toMatch(urlBrewExpected);

    const urlGithubExpected = `https://api.github.com/repos/${Tool.Org}/${Tool.Repo}/releases/latest`;
    const urlGithub: string = getURL(Tool.Org, Tool.Repo, 'github');
    expect(urlGithub).toMatch(urlGithubExpected);
  });
});

describe('getLatestVersion()', () => {
  test('return latest version via brew', async () => {
    nock('https://formulae.brew.sh').get(`/api/formula/${Tool.Repo}.json`).reply(200, jsonTestBrew);

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'brew');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);
  });

  test('return latest version via GitHub', async () => {
    nock('https://api.github.com')
      .get(`/repos/${Tool.Org}/${Tool.Repo}/releases/latest`)
      .reply(200, jsonTestGithub);

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'github');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);
  });

  test('return exception 404', async () => {
    nock('https://formulae.brew.sh').get(`/api/formula/${Tool.Repo}.json`).reply(404);

    await expect(getLatestVersion(Tool.Org, Tool.Repo, 'brew')).rejects.toThrowError(FetchError);
  });
});
