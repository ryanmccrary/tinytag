import TinyTag from '../src/index.js';
import { setCookie } from '../src/cookie.js';

describe('TinyTag', () => {
  let tt;

  beforeEach(() => {
    document.cookie = '';
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    tt = new TinyTag();
    jest.spyOn(tt.queue, 'push'); // Spy on queue.push to check events
    tt.init({ writeKey: 'testkey', dataPlaneUrl: 'http://example.com' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('page queues an event with context', () => {
    tt.page('Home');
    expect(tt.queue.push).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'page',
        name: 'Home',
        context: expect.objectContaining({
          userAgent: navigator.userAgent
        })
      })
    );
  });

  test('track queues an event', () => {
    tt.track('Button Clicked', { button: 'test' });
    expect(tt.queue.push).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'track',
        event: 'Button Clicked',
        properties: { button: 'test' }
      })
    );
  });

  test('identify sets userId and merges traits', () => {
    setCookie('rl_trait', JSON.stringify({ email: 'old@example.com' }));
    tt.identify('user123', { name: 'New User' });
    expect(tt.queue.push).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'identify',
        userId: 'user123',
        traits: { email: 'old@example.com', name: 'New User' }
      })
    );
    expect(document.cookie).toContain('userId=user123');
  });

  test('group queues an event', () => {
    tt.group('group456', { name: 'Test Group' });
    expect(tt.queue.push).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'group',
        groupId: 'group456',
        traits: { name: 'Test Group' }
      })
    );
  });

  test('getAnonymousId uses Segment cookie if present', () => {
    setCookie('ajs_anonymous_id', 'segment-anon-id');
    expect(tt.getAnonymousId()).toBe('segment-anon-id');
  });

  test('getUserId uses RudderStack cookie if present', () => {
    setCookie('rl_user_id', 'rudder-user-id');
    expect(tt.getUserId()).toBe('rudder-user-id');
  });

  test('getTraits uses existing Segment traits', () => {
    setCookie('ajs_trait', JSON.stringify({ age: 30 }));
    expect(tt.getTraits()).toEqual({ age: 30 });
  });

  test('parseQueryParams extracts UTM params', () => {
    delete window.location;
    window.location = new URL('http://example.com?utm_source=google&utm_campaign=test');
    const campaign = tt.parseQueryParams();
    expect(campaign).toEqual({
      source: 'google',
      campaign: 'test'
    });
  });
});