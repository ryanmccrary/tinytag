export async function sendEvent(url, writeKey, event) {
const reqUrl = `${url}/${event.type}`
  try {
    const response = await fetch(reqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${writeKey}:`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
      keepalive: true
    });
    return response.ok;
  } catch (e) {
    return false;
  }
}