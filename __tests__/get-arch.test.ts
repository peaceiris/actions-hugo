import getArch from '../src/get-arch';

describe('getArch', () => {
  test('processor architecture', () => {
    expect(getArch('x64')).toBe('amd64');
    expect(getArch('arm')).toBe('arm');
    expect(getArch('arm64')).toBe('arm64');
  });

  test('exception', () => {
    expect(() => {
      getArch('mips');
    }).toThrowError('mips is not supported');
  });
});
