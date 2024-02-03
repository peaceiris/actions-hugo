import getURL from '../src/get-url';

describe('getURL()', () => {
  test('get a URL to an asset for each platform', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.122.0';
    const urlLinux = `${baseURL}/hugo_0.122.0_linux-amd64.tar.gz`;
    const urlLinuxExtended = `${baseURL}/hugo_extended_0.122.0_linux-amd64.tar.gz`;
    const urlMacOS = `${baseURL}/hugo_0.122.0_darwin-universal.tar.gz`;
    const urlMacOSExtended = `${baseURL}/hugo_extended_0.122.0_darwin-universal.tar.gz`;
    const urlWindows = `${baseURL}/hugo_0.122.0_windows-amd64.zip`;
    expect(getURL('linux', 'amd64', 'false', '0.122.0')).toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'true', '0.122.0')).not.toBe(urlLinux);
    expect(getURL('MyOS', 'amd64', 'false', '0.122.0')).not.toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'false', '0.121.0')).not.toBe(urlLinux);
    expect(getURL('linux', 'amd64', 'true', '0.122.0')).toBe(urlLinuxExtended);
    expect(getURL('darwin', 'universal', 'false', '0.122.0')).toBe(urlMacOS);
    expect(getURL('darwin', 'universal', 'true', '0.122.0')).toBe(urlMacOSExtended);
    expect(getURL('windows', 'amd64', 'false', '0.122.0')).toBe(urlWindows);
  });
});
