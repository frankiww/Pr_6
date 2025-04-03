const url = 'http://localhost:3000';


async function updateData() {
    const response = await fetch('/api/data');
    const data = await response.json();

    document.getElementById('data-container').innerHTML = `
        <h3>Данные API</h3>
        <p><strong>Источник:</strong> ${data.source}</p>
        <p><strong>Время генерации:</strong> ${new Date(data.timestamp).toLocaleTimeString()}</p>
        <pre>${JSON.stringify(data.items, null, 2)}</pre>
    `;
}

document.getElementById('toggle-theme').addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', newTheme);
    // fetch('/theme', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ theme: newTheme })
    // });
    localStorage.setItem('theme', newTheme);

});
// Кнопка обновления данных
document.getElementById('refresh-data').addEventListener('click', updateData);

// Загрузка темы из cookie
function loadTheme() {
    // const themeCookie = document.cookie.split('; ')
    //   .find(row => row.startsWith('theme='));
    
    // if (themeCookie) {
    //   const theme = themeCookie.split('=')[1];
    //   console.log("Тема из куки:", theme);
    //   document.documentElement.setAttribute('data-theme', theme);
    // } else{
    //     console.log("Куки с темой нет");
    // }
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', theme);
  }

// Инициализация
loadTheme();
updateData();

// Автообновление каждые 5 секунд
setInterval(updateData, 5000);

document.getElementById('logout').addEventListener('click', async() => {
  const response = await fetch('/logout', {
    method:'POST',
    credentials: 'include'
  });
  if (response.ok){
    alert("Вы успешно вышли");
    window.location.href = '/';
  }

});