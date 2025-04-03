let token = null;
const url = 'http://localhost:3000';

document.getElementById('regForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const result = await response.json();
    document.getElementById('regMessage').textContent = result.message || 'Не удалось зарегистрироваться';

});

document.getElementById('loginForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const result = await response.json();
    
    // if (response.ok){
    //     token = result.token;
    //     document.getElementById('loginMessage').textContent = 'Вы успешно вошли';
    // } else{
    //     document.getElementById('loginMessage').textContent = result.message || "Не удалось войти";
    // }
    if (result.success){
        window.location.href = '/profile'; // Перейдем на страницу профиля
    }
    else{
        document.getElementById('loginMessage').textContent = result.message || "Не удалось войти";
    }
});


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

// Автообновление каждые 5 секунд
setInterval(updateData, 5000);