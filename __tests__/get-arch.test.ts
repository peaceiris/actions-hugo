import getArch from '../src/get-arch';

describe('getArch', () => {
  const groups = [
    {
      condition: 'when hugo version < 0.102.0',
      conventions: {
        arch: {
          darwinUniversal: false,
          dropped32BitSupport: false,
          standardizedNaming: false,
        },
        os: {
          renamedMacOS: false,
          downcasedAll: false
        }
      },
      tests: [
        { arch: 'x64', os: 'linux', expected: '64bit' },
        { arch: 'x64', os: 'macOS', expected: '64bit' },
        { arch: 'x64', os: 'windows', expected: '64bit' },
        { arch: 'arm', os: 'linux', expected: 'ARM' },
        { arch: 'arm', os: 'macOS', expected: 'ARM' },
        { arch: 'arm', os: 'windows', expected: 'ARM' },
        { arch: 'arm64', os: 'linux', expected: 'ARM64' },
        { arch: 'arm64', os: 'macOS', expected: 'ARM64' },
        { arch: 'arm64', os: 'windows', expected: 'ARM64' },
      ]
    },
    {
      condition: 'when hugo version === 0.102.z',
      conventions: {
        arch: {
          darwinUniversal: true,
          dropped32BitSupport: true,
          standardizedNaming: false,
        },
        os: {
          renamedMacOS: true,
          downcasedAll: false
        }
      },
      tests: [
        { arch: 'x64', os: 'linux', expected: '64bit' },
        { arch: 'x64', os: 'macOS', expected: 'universal' },
        { arch: 'x64', os: 'windows', expected: '64bit' },
        { arch: 'arm', os: 'linux', throws: true },
        { arch: 'arm', os: 'macOS', expected: 'universal' },
        { arch: 'arm', os: 'windows', throws: true },
        { arch: 'arm64', os: 'linux', expected: 'ARM64' },
        { arch: 'arm64', os: 'macOS', expected: 'universal' },
        { arch: 'arm64', os: 'windows', expected: 'ARM64' },
      ]
    },
    {
      condition: 'when hugo version >= 0.103.0',
      conventions: {
        arch: {
          darwinUniversal: true,
          dropped32BitSupport: true,
          standardizedNaming: true,
        },
        os: {
          renamedMacOS: true,
          downcasedAll: true
        }
      },
      tests: [
        { arch: 'x64', os: 'linux', expected: 'amd64' },
        { arch: 'x64', os: 'macOS', expected: 'universal' },
        { arch: 'x64', os: 'windows', expected: 'amd64' },
        { arch: 'arm', os: 'linux', throws: true },
        { arch: 'arm', os: 'macOS', expected: 'universal' },
        { arch: 'arm', os: 'windows', throws: true },
        { arch: 'arm64', os: 'linux', expected: 'arm64' },
        { arch: 'arm64', os: 'macOS', expected: 'universal' },
        { arch: 'arm64', os: 'windows', expected: 'arm64' },
      ]
    },
    {
      condition: 'when the architecture is unsupported for the action',
      conventions: {
        arch: {
          darwinUniversal: false,
          dropped32BitSupport: false,
          standardizedNaming: false,
        },
        os: {
          renamedMacOS: false,
          downcasedAll: false
        }
      },
      tests: [
        { arch: 'mips', os: 'linux', throws: true}
      ]
    }
  ].map(function (group) {
    group.tests = group.tests.map(function (example) {
      return Object.assign(example, {
        toString: function () {
          let name = `${example.os} on ${example.arch} `
          name += example?.throws ? 'throws as not supported' : `returns ${example.expected}`
          return name;
        }
      });
    })
    return Object.assign(group, { toString: function () { return group.condition } });
  });

  describe.each(groups)('%s', ({ conventions, tests }) => {
    test.each(tests)('%s', ({ arch, os, throws, expected }) => {
      if (throws) {
        expect(() => {
          getArch(arch, os, conventions)
        }).toThrow(`${arch} is not supported`);
      } else {
        expect(getArch(arch, os, conventions)).toBe(expected);
      }
    })
  })
});
