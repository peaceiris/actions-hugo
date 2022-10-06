import getOS from '../src/get-os';

describe('getOS', () => {
  test('os type', () => {
    expect(getOS('linux', '0.101.0')).toBe('Linux');
    expect(getOS('darwin', '0.101.0')).toBe('macOS');
    expect(getOS('win32', '0.101.0')).toBe('Windows');

    expect(getOS('linux', '0.102.0')).toBe('Linux');
    expect(getOS('darwin', '0.102.0')).toBe('darwin');
    expect(getOS('win32', '0.102.0')).toBe('Windows');

    expect(getOS('linux', '0.103.0')).toBe('linux');
    expect(getOS('darwin', '0.103.0')).toBe('darwin');
    expect(getOS('win32', '0.103.0')).toBe('windows');

    expect(getOS('linux', '0.104.0')).toBe('linux');
    expect(getOS('darwin', '0.104.0')).toBe('darwin');
    expect(getOS('win32', '0.104.0')).toBe('windows');
  });

  test('exception', () => {
    expect(() => {
      getOS('centos', '0.101.0');
    }).toThrowError('centos is not supported');
  });
});
