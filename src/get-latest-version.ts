import fetch from 'node-fetch';

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
  const json = await response.json();
  let latestVersion = '';
  if (api === 'brew') {
    latestVersion = json.versions.stable;
  } else if (api === 'github') {
    latestVersion = json.tag_name;
  }
  return latestVersion;
}
