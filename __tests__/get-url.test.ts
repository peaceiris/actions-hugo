import getURL from '../src/get-url';

describe('getURL()', () => {
  test('get URLs to Linux assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('Linux', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_Linux-64bit.tar.gz`,
      `${baseURL}/hugo_0.58.2_linux-amd64.tar.gz`
    ]);
    expect(getURL('Linux', 'ARM64', 'true', '0.58.2')).toEqual([
      `${baseURL}/hugo_extended_0.58.2_Linux-ARM64.tar.gz`,
      `${baseURL}/hugo_extended_0.58.2_linux-arm64.tar.gz`
    ]);
  });

  test('get URLs to macOS assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.161.1';
    expect(getURL('macOS', '64bit', 'true', '0.161.1')).toEqual([
      `${baseURL}/hugo_extended_0.161.1_macOS-64bit.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_macOS-all.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_darwin-universal.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_darwin-universal.pkg`
    ]);
  });

  test('get URLs to Windows assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('Windows', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_Windows-64bit.zip`,
      `${baseURL}/hugo_0.58.2_windows-amd64.zip`
    ]);
    expect(getURL('Windows', 'ARM64', 'true', '0.58.2')).toEqual([
      `${baseURL}/hugo_extended_0.58.2_Windows-ARM64.zip`,
      `${baseURL}/hugo_extended_0.58.2_windows-arm64.zip`
    ]);
  });

  test('get a fallback URL to an unknown OS asset', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('MyOS', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_MyOS-64bit.tar.gz`
    ]);
  });
});
