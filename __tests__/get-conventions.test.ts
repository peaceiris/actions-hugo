import getConventions from "../src/get-conventions";

describe('getConventions()', () => {
  const groups = [
    {
      condition: 'when hugo version < 0.102.0',
      version: '0.101.0',
      expected: {
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
    },
    {
      condition: 'when hugo version === 0.102.z',
      version: '0.102.0',
      expected: {
        arch: {
          darwinUniversal: true,
          dropped32BitSupport: true,
          standardizedNaming: false,
        },
        os: {
          renamedMacOS: true,
          downcasedAll: false
        }
      }
    },
    {
      condition: 'when hugo version >= 0.103.0',
      version: '0.103.0',
      expected: {
        arch: {
          darwinUniversal: true,
          dropped32BitSupport: true,
          standardizedNaming: true,
        },
        os: {
          renamedMacOS: true,
          downcasedAll: true
        }
      }
    }
  ].map(function (group) {
    return Object.assign(group, { toString: function () { return group.condition } });
  });

  test.each(groups)('%s', ({ expected, version }) => {
    expect(getConventions(version)).toEqual(expected);
  });
});
