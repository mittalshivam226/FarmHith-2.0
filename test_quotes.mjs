const apiKey = '"AIzaSyDhES4H51a5E6ZCP3eBlwUpweX1Qi2qIR8"'; // With exact literal quotes!
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

async function testFetch() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3005"
      },
      body: JSON.stringify({
        email: "admin@farmhith.in",
        password: "admin123",
        returnSecureToken: true
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch(e) {
    console.error("Fetch failed:", e.message);
  }
}

testFetch();
