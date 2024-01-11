document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://quilled-nervous-leopon.glitch.me/";
    fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
          tag: "Belgium";  
        })
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
