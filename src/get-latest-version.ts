import fetch, {FetchError} from 'node-fetch';

interface BrewFormulaResponse {
  versions: {
    stable: string;
  };
}

interface GitHubReleaseResponse {
  tag_name: string;
}

export function getURL(org: string, repo: string, api: string): string {
  let url = '';

  if (api === 'brew') {
    url = `https://formulae.brew.sh/api/formula/${repo}.json`;
  } else if (api === 'github') {
    url = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
  }

  return url;
}

export async function getLatestVersion(org: string, repo: string, api: string): Promise<string> {
  const url = getURL(org, repo, api);
  const response = await fetch(url);
  if (!response.ok) {
    throw new FetchError(`request to ${url} failed with status ${response.status}`, 'system');
  }

  const json = await response.json();
  let latestVersion = '';
  if (api === 'brew') {
    latestVersion = (json as BrewFormulaResponse).versions.stable;
  } else if (api === 'github') {
    latestVersion = (json as GitHubReleaseResponse).tag_name;
  }
  return latestVersion;
}
