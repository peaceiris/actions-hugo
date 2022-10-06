import getArch from '../src/get-arch';

describe('getArch', () => {
  test('processor architecture < 0.102.0', () => {
    expect(getArch('x64', 'linux', '0.101.0')).toBe('64bit');
    expect(getArch('x64', 'macOS', '0.101.0')).toBe('64bit');
    expect(getArch('x64', 'windows', '0.101.0')).toBe('64bit');

    expect(getArch('arm', 'linux', '0.101.0')).toBe('ARM');
    expect(getArch('arm', 'macOS', '0.101.0')).toBe('ARM');
    expect(getArch('arm', 'windows', '0.101.0')).toBe('ARM');

    expect(getArch('arm64', 'linux', '0.101.0')).toBe('ARM64');
    expect(getArch('arm64', 'macOS', '0.101.0')).toBe('ARM64');
    expect(getArch('arm64', 'windows', '0.101.0')).toBe('ARM64');
  });

  test('processor architecture === 0.102.z', () => {
    expect(getArch('x64', 'linux', '0.102.0')).toBe('64bit');
    expect(getArch('x64', 'macOS', '0.102.0')).toBe('universal');
    expect(getArch('x64', 'windows', '0.102.0')).toBe('64bit');

    expect(getArch('arm', 'macOS', '0.102.0')).toBe('universal');

    expect(getArch('arm64', 'linux', '0.102.0')).toBe('ARM64');
    expect(getArch('arm64', 'macOS', '0.102.0')).toBe('universal');
    expect(getArch('arm64', 'windows', '0.102.0')).toBe('ARM64');
  });

  test('processor architecture === 0.103.z', () => {
    expect(getArch('x64', 'linux', '0.103.0')).toBe('amd64');
    expect(getArch('x64', 'darwin', '0.103.0')).toBe('universal');
    expect(getArch('x64', 'windows', '0.103.0')).toBe('amd64');

    expect(getArch('arm', 'darwin', '0.103.0')).toBe('universal');

    expect(getArch('arm64', 'linux', '0.103.0')).toBe('arm64');
    expect(getArch('arm64', 'darwin', '0.103.0')).toBe('universal');
    expect(getArch('arm64', 'windows', '0.103.0')).toBe('arm64');
  });

  test('processor architecture > 0.103.0', () => {
    expect(getArch('x64', 'linux', '0.104.0')).toBe('amd64');
    expect(getArch('x64', 'darwin', '0.104.0')).toBe('universal');
    expect(getArch('x64', 'windows', '0.104.0')).toBe('amd64');

    expect(getArch('arm', 'darwin', '0.104.0')).toBe('universal');

    expect(getArch('arm64', 'linux', '0.104.0')).toBe('arm64');
    expect(getArch('arm64', 'darwin', '0.104.0')).toBe('universal');
    expect(getArch('arm64', 'windows', '0.104.0')).toBe('arm64');
  });

  test('exception', () => {
    expect(() => {
      getArch('mips', 'linux', '0.101.0');
    }).toThrowError('mips is not supported');

    expect(() => {
      getArch('arm', 'linux', '0.102.0')
    }).toThrowError('arm is not supported');
  });
});
