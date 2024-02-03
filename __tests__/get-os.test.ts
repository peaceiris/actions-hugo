import getOS from '../src/get-os';

describe('getOS', () => {
  test('os type', () => {
    expect(getOS('linux')).toBe('linux');
    expect(getOS('darwin')).toBe('darwin');
    expect(getOS('win32')).toBe('windows');
  });

  test('exception', () => {
    expect(() => {
      getOS('centos');
    }).toThrowError('centos is not supported');
  });
});
