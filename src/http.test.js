import { sendEvent } from './http.js';

describe('HTTP Utility', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  test('sendEvent makes a POST request', async () => {
    const result = await sendEvent('http://example.com', 'key', { type: 'test' });
    expect(fetch).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
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