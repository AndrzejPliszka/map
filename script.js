document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "http://127.0.0.1:3000/";
    fetch(apiUrl, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'}
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<p>${JSON.stringify(data.message)}</p>`;
      })
      .catch(error => {
        console.error('Fetch error:', error.message);
      });
});
