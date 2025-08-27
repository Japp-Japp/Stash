addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const ICS_URL = 'https://rms.caspeco.se/api/cloud//v1/calendarfile/ical/7a2d9c22-0104-4a5c-b2e8-6c7d4fc4aee1?system=se_ipsgot&hash=OfRVlNxr0qKssR1hhEOoXGfTSdQ%2B0dzHD%2FEPwiymJoQ%3D';

  try {
    const res = await fetch(ICS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

	//return ics data
    return new Response(await res.text(), {
      status: res.status,
      headers: {
        'Content-Type': 'text/calendar',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err) {
    return new Response('Error fetching calendar: ' + err.message, {
      status: 500
    });
  }
}
