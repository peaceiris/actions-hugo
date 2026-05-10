export interface conventions {
  arch: {
    darwinUniversal: boolean,
    dropped32BitSupport: boolean,
    standardizedNaming: boolean
  },
  os: {
    renamedMacOS: boolean,
    downcasedAll: boolean
  }
}

export default function getConventions(version: string,): conventions {
  const segments = version.split('.').map(s => parseInt(s));
  const stableOrNewer = segments[0] > 0;
  const newerThan103 = stableOrNewer || segments[1] >= 103
  const newerThan102 = stableOrNewer || segments[1] >= 102
  return {
    arch: {
      darwinUniversal: newerThan102,
      dropped32BitSupport: newerThan102,
      standardizedNaming: newerThan103
    },
    os: {
      renamedMacOS: newerThan102,
      downcasedAll: newerThan103
    }
  }
}
