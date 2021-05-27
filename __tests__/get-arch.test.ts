import getArch from '../src/get-arch';

describe('getArch', () => {
  test('processor architecture', () => {
    expect(getArch('x64')).toBe('64bit');
    expect(getArch('arm')).toBe('ARM');
    expect(getArch('arm64')).toBe('ARM64');
  });

  test('exception', () => {
    expect(() => {
      getArch('mips');
    }).toThrowError('mips is not supported');
  });
});
