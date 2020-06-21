import getURL from '../src/get-url';

describe('getURL()', () => {
  test('test', () => {
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download/v0.58.2';
    const urlLinux = `${baseURL}/hugo_0.58.2_Linux-64bit.tar.gz`;
    const urlLinuxExtended = `${baseURL}/hugo_extended_0.58.2_Linux-64bit.tar.gz`;
    const urlMacOS = `${baseURL}/hugo_0.58.2_macOS-64bit.tar.gz`;
    const urlWindows = `${baseURL}/hugo_0.58.2_Windows-64bit.zip`;
    expect(getURL('Linux', 'false', '0.58.2')).toBe(urlLinux);
    expect(getURL('Linux', 'true', '0.58.2')).not.toBe(urlLinux);
    expect(getURL('MyOS', 'false', '0.58.2')).not.toBe(urlLinux);
    expect(getURL('Linux', 'false', '0.58.1')).not.toBe(urlLinux);
    expect(getURL('Linux', 'true', '0.58.2')).toBe(urlLinuxExtended);
    expect(getURL('macOS', 'false', '0.58.2')).toBe(urlMacOS);
    expect(getURL('Windows', 'false', '0.58.2')).toBe(urlWindows);
  });
});
