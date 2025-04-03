const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const session = require('express-session');


dotenv.config();
const app = express();
const port = 3000;
const cacheDir = path.join(__dirname, 'cache');


app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Конфигурация сессии
app.use(session({
    secret: '185FDB266A63B565E36CF855B6B7E',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Для разработки на localhost
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));


let users = [];

function getCachedData(key, ttlSeconds = 30) {
    const cacheFile = path.join(cacheDir, `${key}.json`);
  
    // Если файл существует и не устарел
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const now = new Date().getTime();
      const fileAge = (now - stats.mtimeMs) / 1000;
  
      if (fileAge < ttlSeconds) {
        const cachedData = fs.readFileSync(cacheFile, 'utf-8');
        return JSON.parse(cachedData);
      }
    }
  
    // Генерируем новые данные
    const newData = { 
      items: [1, 2, 3], 
      timestamp: Date.now(),
      source: 'Файловый кэш'
    };
  
    // Сохраняем в файл
    fs.writeFileSync(cacheFile, JSON.stringify(newData));
  
    // Удаляем файл после истечения TTL
    setTimeout(() => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    }, ttlSeconds * 1000);
  
    return newData;
  }

// API для получения данных
app.get('/api/data', (req, res) => {
    const data = getCachedData('api_data');
    res.json(data);
  });
  
  // API для сохранения темы
app.post('/theme', (req, res) => {
    const theme = req.body.theme;
    res.cookie('theme', theme, {
        maxAge: 86400000, // 1 день
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
    });
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html')); // Отправляем файл index.html
});

app.post('/register', (req,res) => {
    const {username, password} = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({message: 'Пользователь уже существует'});
    }

    const newUser = {id: users.length + 1, username, password}
    users.push(newUser);
    res.status(201).json({message: 'Пользователь успешно зарегистрирован'});
    
})

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const user = users.find(u => u.username===username && u.password===password);
    if (!user){
        res.status(401).json({message: "Неверные данные"});
        return;
    }

    // const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
    //     expiresIn: '1h'
    // });
    // res.json({token});
    req.session.user = {username};
    return res.json({ success: true });

});

app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        return res.json({ authenticated: true, user: req.session.user });
    }
    res.json({ authenticated: false });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Ошибка выхода');
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

app.get('/profile', (req, res) => {
    if (req.session.user)
    {
        res.sendFile(path.join(__dirname, '../frontend/profile.html'));
    } else{
        res.redirect('/');
    }

});
// const authenticalJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader)
//     {
//         const token = authHeader.split(' ')[1];
//         jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
    
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };



app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}/`);
});