import getArch from '../src/get-arch';

describe('getArch', () => {
  const groups = [
    {
      condition: 'when hugo version < 0.102.0',
      conventions: {
        arch: {
          darwinUniversal: false,
          droppedWindowsArmSupport: false,
          standardizedNaming: false
        },
        os: {
          renamedMacOS: false,
          downcasedAll: false
        }
      },
      tests: [
        {arch: 'x64', os: 'linux', expected: '64bit'},
        {arch: 'x64', os: 'darwin', expected: '64bit'},
        {arch: 'x64', os: 'macOS', expected: '64bit'},
        {arch: 'x64', os: 'windows', expected: '64bit'},
        {arch: 'arm', os: 'linux', expected: 'ARM'},
        {arch: 'arm', os: 'darwin', expected: 'ARM'},
        {arch: 'arm', os: 'macOS', expected: 'ARM'},
        {arch: 'arm', os: 'windows', expected: 'ARM'},
        {arch: 'arm64', os: 'linux', expected: 'ARM64'},
        {arch: 'arm64', os: 'darwin', expected: 'ARM64'},
        {arch: 'arm64', os: 'macOS', expected: 'ARM64'},
        {arch: 'arm64', os: 'windows', expected: 'ARM64'}
      ]
    },
    {
      condition: 'when hugo version === 0.102.z',
      conventions: {
        arch: {
          darwinUniversal: true,
          droppedWindowsArmSupport: true,
          standardizedNaming: false
        },
        os: {
          renamedMacOS: false,
          downcasedAll: false
        }
      },
      tests: [
        {arch: 'x64', os: 'linux', expected: '64bit'},
        {arch: 'x64', os: 'macOS', expected: 'universal'},
        {arch: 'x64', os: 'windows', expected: '64bit'},
        {arch: 'arm', os: 'linux', expected: 'ARM'},
        {arch: 'arm', os: 'macOS', expected: 'universal'},
        {arch: 'arm', os: 'windows', throws: true},
        {arch: 'arm64', os: 'linux', expected: 'ARM64'},
        {arch: 'arm64', os: 'macOS', expected: 'universal'},
        {arch: 'arm64', os: 'windows', expected: 'ARM64'}
      ]
    },
    {
      condition: 'when hugo version >= 0.103.0',
      conventions: {
        arch: {
          darwinUniversal: true,
          droppedWindowsArmSupport: true,
          standardizedNaming: true
        },
        os: {
          renamedMacOS: true,
          downcasedAll: true
        }
      },
      tests: [
        {arch: 'x64', os: 'linux', expected: 'amd64'},
        {arch: 'x64', os: 'macOS', expected: 'universal'},
        {arch: 'x64', os: 'windows', expected: 'amd64'},
        {arch: 'arm', os: 'linux', expected: 'arm'},
        {arch: 'arm', os: 'macOS', expected: 'universal'},
        {arch: 'arm', os: 'windows', throws: true},
        {arch: 'arm64', os: 'linux', expected: 'arm64'},
        {arch: 'arm64', os: 'macOS', expected: 'universal'},
        {arch: 'arm64', os: 'windows', expected: 'arm64'}
      ]
    },
    {
      condition: 'when the architecture is unsupported for the action',
      conventions: {
        arch: {
          darwinUniversal: false,
          droppedWindowsArmSupport: false,
          standardizedNaming: false
        },
        os: {
          renamedMacOS: false,
          downcasedAll: false
        }
      },
      tests: [{arch: 'mips', os: 'linux', throws: true}]
    }
  ];

  const passingTests = groups.flatMap(group =>
    group.tests
      .filter(example => !example.throws)
      .map(example => ({
        ...example,
        condition: group.condition,
        conventions: group.conventions
      }))
  );

  const throwingTests = groups.flatMap(group =>
    group.tests
      .filter(example => example.throws)
      .map(example => ({
        ...example,
        condition: group.condition,
        conventions: group.conventions
      }))
  );

  test.each(passingTests)(
    '$condition: $os on $arch returns $expected',
    ({arch, os, conventions, expected}) => {
      expect(getArch(arch, os, conventions)).toBe(expected);
    }
  );

  test.each(throwingTests)(
    '$condition: $os on $arch throws as not supported',
    ({arch, os, conventions}) => {
      expect(() => {
        getArch(arch, os, conventions);
      }).toThrow(`${arch} is not supported`);
    }
  );
});
