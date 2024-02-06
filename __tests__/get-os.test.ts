import getOS from '../src/get-os';

describe('getOS', () => {
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
        { os: 'linux', expected: 'Linux' },
        { os: 'darwin', expected: 'macOS' },
        { os: 'win32', expected: 'Windows' },
      ],
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
        { os: 'linux', expected: 'Linux' },
        { os: 'darwin', expected: 'darwin' },
        { os: 'win32', expected: 'Windows' },
      ],
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
        { os: 'linux', expected: 'linux' },
        { os: 'darwin', expected: 'darwin' },
        { os: 'win32', expected: 'windows' },
      ],
    }
  ].map(function (group) {
    group.tests = group.tests.map(function (example) {
      return Object.assign(example, {
        toString: function () {
          return `${example.os} returns ${example.expected}`
        }
      });
    })
    return Object.assign(group, { toString: function () { return group.condition } });
  });

  describe.each(groups)('%s', ({ conventions, tests }) => {
    test.each(tests)('%s', ({ os, expected }) => {
      expect(getOS(os, conventions)).toBe(expected);
    })
  });

  test('exception', () => {
    const conventions = {
      arch: {
        darwinUniversal: false,
        dropped32BitSupport: false,
        standardizedNaming: false,
      },
      os: {
        renamedMacOS: false,
        downcasedAll: false
      }
    }

    expect(() => {
      getOS('centos', conventions);
    }).toThrow('centos is not supported');
  });
});
