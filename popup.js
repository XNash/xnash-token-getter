document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentUrl = new URL(currentTab.url);
    const domain = currentUrl.hostname;

    chrome.cookies.getAll({ domain }, (cookies) => {
      const cookiesList = document.getElementById('cookies-list');
      
      const tokenCookie = cookies.find(cookie => cookie.name === 'token');
      
      if (!tokenCookie) {
        cookiesList.innerHTML = '<p>Aucun token trouvé pour ce site.</p>';
        return;
      }

      cookiesList.innerHTML = `
        <div class="cookie-item">
          <h3>Token</h3>
          <p><strong>Valeur :</strong> ${tokenCookie.value}</p>
        </div>
      `;

      const copyButton = document.getElementById('copy-button');
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(tokenCookie.value)
          .then(() => {
            copyButton.textContent = 'Token copié !';
            copyButton.disabled = true;
            setTimeout(() => {
              copyButton.textContent = 'Copier le token';
              copyButton.disabled = false;
            }, 2000);
          })
          .catch(err => {
            console.error('Erreur lors de la copie :', err);
          });
      });
    });
  });
});
