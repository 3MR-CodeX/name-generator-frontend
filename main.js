async function generateName() {
  const desc = document.getElementById("descInput").value;
  const response = await fetch(`https://YOUR_REPLIT_URL/generate?desc=${encodeURIComponent(desc)}`, {
    headers: {
      'x-api-key': 'your-secret-key' // if you added backend protection
    }
  });
  const data = await response.json();
  document.getElementById("result").textContent = `Name: ${data.name}`;
}
