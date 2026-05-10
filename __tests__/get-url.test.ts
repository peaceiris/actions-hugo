import getURL from '../src/get-url';

describe('getURL()', () => {
  test('get URLs to Linux assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('Linux', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_Linux-64bit.tar.gz`,
      `${baseURL}/hugo_0.58.2_Linux_64bit.tar.gz`,
      `${baseURL}/hugo_0.58.2_linux-amd64.tar.gz`,
      `${baseURL}/hugo_v0.58.2_Linux-64bit.tar.gz`,
      `${baseURL}/hugo_v0.58.2_Linux_64bit.tar.gz`,
      `${baseURL}/hugo_v0.58.2_linux-amd64.tar.gz`
    ]);
    expect(getURL('Linux', 'ARM64', 'true', '0.58.2')).toEqual([
      `${baseURL}/hugo_extended_0.58.2_Linux-ARM64.tar.gz`,
      `${baseURL}/hugo_extended_0.58.2_Linux_ARM64.tar.gz`,
      `${baseURL}/hugo_extended_0.58.2_linux-arm64.tar.gz`,
      `${baseURL}/hugo_extended_v0.58.2_Linux-ARM64.tar.gz`,
      `${baseURL}/hugo_extended_v0.58.2_Linux_ARM64.tar.gz`,
      `${baseURL}/hugo_extended_v0.58.2_linux-arm64.tar.gz`
    ]);
  });

  test('get URLs to legacy Linux assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.20.3';
    expect(getURL('Linux', '64bit', 'false', '0.20.3')).toEqual([
      `${baseURL}/hugo_0.20.3_Linux-64bit.tar.gz`,
      `${baseURL}/hugo_0.20.3_Linux_64bit.tar.gz`,
      `${baseURL}/hugo_0.20.3_linux-amd64.tar.gz`,
      `${baseURL}/hugo_v0.20.3_Linux-64bit.tar.gz`,
      `${baseURL}/hugo_v0.20.3_Linux_64bit.tar.gz`,
      `${baseURL}/hugo_v0.20.3_linux-amd64.tar.gz`
    ]);
  });

  test('get URLs to macOS assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.161.1';
    expect(getURL('macOS', '64bit', 'true', '0.161.1')).toEqual([
      `${baseURL}/hugo_extended_0.161.1_macOS-64bit.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_macOS-64bit.zip`,
      `${baseURL}/hugo_extended_0.161.1_macOS-all.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_darwin-universal.tar.gz`,
      `${baseURL}/hugo_extended_0.161.1_darwin-universal.pkg`,
      `${baseURL}/hugo_extended_v0.161.1_macOS-64bit.tar.gz`,
      `${baseURL}/hugo_extended_v0.161.1_macOS-64bit.zip`,
      `${baseURL}/hugo_extended_v0.161.1_macOS-all.tar.gz`,
      `${baseURL}/hugo_extended_v0.161.1_darwin-universal.tar.gz`,
      `${baseURL}/hugo_extended_v0.161.1_darwin-universal.pkg`
    ]);
  });

  test('get URLs to macOS 0.102 universal assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.102.0';
    expect(getURL('macOS', 'universal', 'false', '0.102.0')).toEqual([
      `${baseURL}/hugo_0.102.0_macOS-universal.tar.gz`,
      `${baseURL}/hugo_0.102.0_macOS-universal.zip`,
      `${baseURL}/hugo_0.102.0_macOS-all.tar.gz`,
      `${baseURL}/hugo_0.102.0_darwin-universal.tar.gz`,
      `${baseURL}/hugo_0.102.0_darwin-universal.pkg`,
      `${baseURL}/hugo_v0.102.0_macOS-universal.tar.gz`,
      `${baseURL}/hugo_v0.102.0_macOS-universal.zip`,
      `${baseURL}/hugo_v0.102.0_macOS-all.tar.gz`,
      `${baseURL}/hugo_v0.102.0_darwin-universal.tar.gz`,
      `${baseURL}/hugo_v0.102.0_darwin-universal.pkg`
    ]);
  });

  test('get URLs to darwin assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.103.0';
    expect(getURL('darwin', 'universal', 'false', '0.103.0')).toEqual([
      `${baseURL}/hugo_0.103.0_darwin-universal.tar.gz`,
      `${baseURL}/hugo_0.103.0_darwin-universal.pkg`,
      `${baseURL}/hugo_v0.103.0_darwin-universal.tar.gz`,
      `${baseURL}/hugo_v0.103.0_darwin-universal.pkg`
    ]);
  });

  test('get URLs to legacy macOS assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.20.2';
    expect(getURL('macOS', '64bit', 'false', '0.20.2')).toEqual([
      `${baseURL}/hugo_0.20.2_macOS-64bit.tar.gz`,
      `${baseURL}/hugo_0.20.2_macOS-64bit.zip`,
      `${baseURL}/hugo_0.20.2_macOS-all.tar.gz`,
      `${baseURL}/hugo_0.20.2_darwin-universal.tar.gz`,
      `${baseURL}/hugo_0.20.2_darwin-universal.pkg`,
      `${baseURL}/hugo_v0.20.2_macOS-64bit.tar.gz`,
      `${baseURL}/hugo_v0.20.2_macOS-64bit.zip`,
      `${baseURL}/hugo_v0.20.2_macOS-all.tar.gz`,
      `${baseURL}/hugo_v0.20.2_darwin-universal.tar.gz`,
      `${baseURL}/hugo_v0.20.2_darwin-universal.pkg`
    ]);
  });

  test('get URLs to Windows assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('Windows', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_Windows-64bit.zip`,
      `${baseURL}/hugo_0.58.2_windows-amd64.zip`,
      `${baseURL}/hugo_v0.58.2_Windows-64bit.zip`,
      `${baseURL}/hugo_v0.58.2_windows-amd64.zip`
    ]);
    expect(getURL('Windows', 'ARM64', 'true', '0.58.2')).toEqual([
      `${baseURL}/hugo_extended_0.58.2_Windows-ARM64.zip`,
      `${baseURL}/hugo_extended_0.58.2_windows-arm64.zip`,
      `${baseURL}/hugo_extended_v0.58.2_Windows-ARM64.zip`,
      `${baseURL}/hugo_extended_v0.58.2_windows-arm64.zip`
    ]);
  });

  test('get URLs to downcased Windows assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.103.0';
    expect(getURL('windows', 'amd64', 'false', '0.103.0')).toEqual([
      `${baseURL}/hugo_0.103.0_windows-amd64.zip`,
      `${baseURL}/hugo_0.103.0_Windows-amd64.zip`,
      `${baseURL}/hugo_v0.103.0_windows-amd64.zip`,
      `${baseURL}/hugo_v0.103.0_Windows-amd64.zip`
    ]);
  });

  test('get URLs to legacy Windows assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.20.3';
    expect(getURL('Windows', '64bit', 'false', '0.20.3')).toEqual([
      `${baseURL}/hugo_0.20.3_Windows-64bit.zip`,
      `${baseURL}/hugo_0.20.3_windows-amd64.zip`,
      `${baseURL}/hugo_v0.20.3_Windows-64bit.zip`,
      `${baseURL}/hugo_v0.20.3_windows-amd64.zip`
    ]);
  });

  test('get URLs to downcased Linux assets', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.103.0';
    expect(getURL('linux', 'arm', 'false', '0.103.0')).toEqual([
      `${baseURL}/hugo_0.103.0_linux-arm.tar.gz`,
      `${baseURL}/hugo_0.103.0_Linux-arm.tar.gz`,
      `${baseURL}/hugo_0.103.0_Linux_arm.tar.gz`,
      `${baseURL}/hugo_v0.103.0_linux-arm.tar.gz`,
      `${baseURL}/hugo_v0.103.0_Linux-arm.tar.gz`,
      `${baseURL}/hugo_v0.103.0_Linux_arm.tar.gz`
    ]);
  });

  test('get a fallback URL to an unknown OS asset', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    expect(getURL('MyOS', '64bit', 'false', '0.58.2')).toEqual([
      `${baseURL}/hugo_0.58.2_MyOS-64bit.tar.gz`
    ]);
  });
});
