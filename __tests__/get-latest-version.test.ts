import {getURL, getLatestVersion} from '../src/get-latest-version';
import {FetchError} from 'node-fetch';
import {clearMockFetchResponses, mockFetchResponse} from './mocks/node-fetch';
import {Tool} from '../src/constants';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  clearMockFetchResponses();
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
    mockFetchResponse(`https://formulae.brew.sh/api/formula/${Tool.Repo}.json`, 200, jsonTestBrew);

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'brew');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);
  });

  test('return latest version via GitHub', async () => {
    mockFetchResponse(
      `https://api.github.com/repos/${Tool.Org}/${Tool.Repo}/releases/latest`,
      200,
      jsonTestGithub
    );

    const versionLatest: string = await getLatestVersion(Tool.Org, Tool.Repo, 'github');
    expect(versionLatest).toMatch(Tool.TestVersionLatest);
  });

  test('return exception 404', async () => {
    mockFetchResponse(`https://formulae.brew.sh/api/formula/${Tool.Repo}.json`, 404);

    await expect(getLatestVersion(Tool.Org, Tool.Repo, 'brew')).rejects.toThrow(FetchError);
  });
});
