import http from 'http';
import https from 'https';

export class FetchError extends Error {
  name = 'FetchError' as const;

  constructor(
    message: string,
    public type: string,
    systemError?: Record<string, unknown>
  ) {
    super(message);
    if (systemError) {
      Object.assign(this, systemError);
    }
  }
}

interface ResponseLike {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

interface MockResponse {
  body?: unknown;
  status: number;
}

const mockResponses = new Map<string, MockResponse>();
const mockErrors = new Map<string, Error>();

export function mockFetchResponse(url: string, status: number, body?: unknown): void {
  mockResponses.set(url, {
    body,
    status
  });
}

export function mockFetchError(url: string, error: Error): void {
  mockErrors.set(url, error);
}

export function clearMockFetchResponses(): void {
  mockResponses.clear();
  mockErrors.clear();
}

export default async function fetch(url: string | URL): Promise<ResponseLike> {
  const target = url.toString();
  const mockError = mockErrors.get(target);
  if (mockError) {
    throw mockError;
  }

  const mockResponse = mockResponses.get(target);
  if (mockResponse) {
    return {
      ok: mockResponse.status >= 200 && mockResponse.status < 300,
      status: mockResponse.status,
      json: async () => mockResponse.body as unknown,
      text: async () => `${mockResponse.body ?? ''}`
    };
  }

  const client = target.startsWith('https:') ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.get(target, response => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      response.on('end', () => {
        const status = response.statusCode ?? 0;
        const body = Buffer.concat(chunks).toString();

        resolve({
          ok: status >= 200 && status < 300,
          status,
          json: async () => JSON.parse(body) as unknown,
          text: async () => body
        });
      });
    });

    request.on('error', error => {
      reject(new FetchError(error.message, 'system'));
    });
  });
}
