import { sendEvent } from '../src/http.js';

describe('HTTP Utility', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  test('sendEvent makes a POST request with the correcy endpoint', async () => {
    const result = await sendEvent('http://example.com', 'key', { type: 'test' });
    expect(fetch).toHaveBeenCalledWith(
      'http://example.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': expect.stringMatching(/^Basic /),
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ type: 'test' })
      })
    );
    expect(result).toBe(true);
  });

  test('sendEvent handles failure', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    const result = await sendEvent('http://example.com', 'key', { type: 'test' });
    expect(result).toBe(false);
  });
});