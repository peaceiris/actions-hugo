export async function downloadTool(url: string): Promise<string> {
  const version = /hugo(?:_extended)?_([^_]+)_/.exec(url)?.[1] || '';
  process.env.TEST_HUGO_VERSION = version;
  process.env.TEST_HUGO_EXTENDED = url.includes('hugo_extended_') ? 'true' : 'false';
  return '/tmp/hugo-archive';
}

export async function extractTar(assetPath: string, tempDir: string): Promise<string> {
  void assetPath;
  void tempDir;
  return '/tmp/extracted';
}

export async function extractZip(assetPath: string, tempDir: string): Promise<string> {
  void assetPath;
  void tempDir;
  return '/tmp/extracted';
}
