async function testPatch() {
  console.log('--- TESTING PROJECT PATCH API ---');
  try {
    const res = await fetch('http://localhost:3000/api/projects/2', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalDestination: 'Test Goal' }),
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

testPatch();
