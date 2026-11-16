# Dart Sass installation details

See the [README](../README.md) for workflow and Hugo template examples.

## Inputs and compatibility

`dart-sass-version` is optional and defaults to an empty string. When omitted or
empty, it causes no Sass network requests, installation, or PATH changes. When
set, it must be a fixed `major.minor.patch` version, such as `1.108.2`. The action
rejects `latest`, ranges, `v` prefixes, prereleases, and arbitrary download URLs.

The installer uses standalone releases from [sass/dart-sass](https://github.com/sass/dart-sass).
Hugo **0.114.0 or later** is required to use this standalone executable. Select
`"transpiler" "dartsass"` in `css.Sass`, or in `resources.ToCSS` on older Hugo
versions. Installation is independent of the `extended` input. The old
`dart-sass-embedded` executable and protocol are outside this action's support.

## Platform and archive selection

The action selects the exact archive for the requested version and the Node
runtime's operating system and architecture:

| Runner | Architectures | Archive suffix |
| --- | --- | --- |
| Linux with glibc | x64, arm64 | `linux-<arch>.tar.gz` |
| macOS | x64, arm64 | `macos-<arch>.tar.gz` |
| Windows | x64, arm64 | `windows-<arch>.zip` |

The full asset name is `dart-sass-<version>-<suffix>`. The selected release must
publish that exact asset. There is no fallback to another version, architecture,
or download host. Linux musl (including Alpine), unknown libc, and unsupported
operating systems or architectures are rejected. Linux detection uses Node's
runtime report to confirm glibc.

After verification, the action extracts the entire standalone `dart-sass`
directory and adds that directory to PATH. Its launcher and sibling `src` runtime
stay together, making `sass` available to subsequent workflow steps. Installing
Sass does not change which Hugo archives a release provides; for example, Hugo
0.160.1 has a Windows arm64 standard archive but no Windows arm64 extended archive.

## GitHub authentication

The `github-token` input defaults to `${{ github.token }}`. Read-only permissions
suffice; no additional write permissions are needed. The token authenticates only
the exact release metadata endpoint on `https://api.github.com`, with redirects
disabled. It is never passed to archive downloads or included in installer logs
or errors.

To use another token, set the input explicitly:

```yaml
- uses: peaceiris/actions-hugo@v3
  with:
    hugo-version: '0.160.1'
    dart-sass-version: '1.108.2'
    github-token: ${{ secrets.SASS_METADATA_TOKEN }}
```

Set `github-token: ''` to make unauthenticated metadata requests instead. This has
lower API rate limits. An explicitly empty input remains empty: the action never
falls back to `GITHUB_TOKEN` or another environment token. When Sass is disabled,
the action does not make a Sass metadata request regardless of the token input.

## Integrity checks and failures

The action fetches official release metadata for the requested version, confirms
the tag and matching asset, and requires a digest in the form `sha256:<64 hex digits>`.
It also checks that the download URL matches the expected official release URL.
After downloading, it computes the archive's SHA-256 digest and compares it with
the API digest **before extraction or execution**.

The action fails closed on:

- Unsupported platforms, invalid versions, or missing release assets.
- API failures, including authentication errors, rate limits, redirects, and invalid metadata.
- Missing or malformed digests, download/read errors, or checksum mismatches.
- Extraction failures; the Sass directory is not added to PATH if extraction fails.

There is no manual checksum input or unverified fallback. Older releases often
have no API digest, including 1.89.0 and earlier. Choose a release with
digest-bearing assets, such as 1.108.2. The installer checks the actual metadata;
it does not infer digest or asset availability from the version number alone.

## Trust model

The digest and archive come from the same publisher through GitHub. Verification
checks that the downloaded bytes match the publisher's current metadata. It is
not a signature, provenance attestation, or an independent immutable checksum
pin. A fixed version does not independently prevent replacement of a release
asset and its digest. GitHub API availability and the integrity of the publisher's
release metadata remain part of the trust and availability model.
