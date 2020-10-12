import getOS from '../src/get-os';

describe('getOS', () => {
  test('os type', () => {
    expect(getOS('linux')).toBe('Linux');
    expect(getOS('darwin')).toBe('macOS');
    expect(getOS('win32')).toBe('Windows');
  });

  test('exception', () => {
    expect(() => {
      getOS('centos');
    }).toThrowError('centos is not supported');
  });
});
