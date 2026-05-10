import {spawn} from 'child_process';

interface ExecOptions {
  listeners?: {
    stdout?: (data: Buffer) => void;
    stderr?: (data: Buffer) => void;
  };
}

export async function exec(
  commandLine: string,
  args: string[] = [],
  options: ExecOptions = {}
): Promise<number> {
  if (commandLine === 'hugo') {
    const version = process.env.TEST_HUGO_VERSION || '';
    const extended = process.env.TEST_HUGO_EXTENDED === 'true' ? ' extended' : '';
    options.listeners?.stdout?.(Buffer.from(`hugo v${version}${extended}\n`));
    return 0;
  }

  return new Promise((resolve, reject) => {
    const child = spawn(commandLine, args);

    child.stdout?.on('data', (data: Buffer) => {
      options.listeners?.stdout?.(data);
    });
    child.stderr?.on('data', (data: Buffer) => {
      options.listeners?.stderr?.(data);
    });
    child.on('error', reject);
    child.on('close', code => {
      resolve(code ?? 0);
    });
  });
}
