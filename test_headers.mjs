const apiKey = "AIzaSyDhES4H51a5E6ZCP3eBlwUpweX1Qi2qIR8";
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

async function testFetch() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3005",
        "Referer": "http://localhost:3005/login"
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
