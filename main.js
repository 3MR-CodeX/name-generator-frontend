async function generateName() {
  const desc = document.getElementById("descInput").value;

  const response = await fetch('https://8184eea2-c8d9-4154-a12e-29f09aa91422-00-3skvnrkya6fio.kirk.replit.dev/generate?desc=' + encodeURIComponent(desc), {
    headers: {
      'x-api-key': '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' // This must match what's in your backend
    }
  });

  const data = await response.json();
  document.getElementById("result").textContent = `Name: ${data.name}`;
}
