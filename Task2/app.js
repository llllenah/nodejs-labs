const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const students = [
    {
        slug: "kamila",
        name: "Каміла Сугак",
        group: "ІП-42",
        university: "КПІ",
        faculty: "ФІОТ",
        age: 18,
        courses: ["Node.js", "Frontend", "Backend"],
        hobby: "Програмування",
        photo: "/images/kamila.jpg",
        description: "Каміла завжди цікавилася технологіями та програмуванням. Вона обожнює вирішувати складні задачі і бути ініціативною у проєктах."
    },
    {
        slug: "olena",
        name: "Олена Сергієнко",
        group: "ІП-42",
        university: "КПІ",
        faculty: "ФІОТ",
        age: 19,
        courses: ["Node.js", "Python", "Databases"],
        hobby: "Програмування",
        photo: "/images/olena.jpg",
        description: "Олена енергійна, відповідальна і завжди готова підтримати команду. Вона активно розвиває свої навички в Python і роботі з базами даних."
    },
    {
        slug: "yana",
        name: "Яна Книр",
        group: "ІП-42",
        university: "КПІ",
        faculty: "ФІОТ",
        age: 18,
        courses: ["Java", "Algorithms"],
        hobby: "Програмування",
        photo: "/images/yana.jpg",
        description: "Яна поступила до КПІ, бо програмування було її мрією з дитинства. Вона обожнює логічні задачі та алгоритми."
    },
    {
        slug: "dasha",
        name: "Дар'я Меньша",
        group: "ІП-42",
        university: "КПІ",
        faculty: "ФІОТ",
        age: 18,
        courses: ["Frontend", "UX/UI"],
        hobby: "Програмування",
        photo: "/images/dasha.jpg",
        description: "Дар’я дуже спокійна і добра, завжди допомагає іншим. Вона любить Frontend та UX/UI дизайн."
    },
    {
        slug: "sergiy",
        name: "Сергій Адасовський",
        group: "ІП-42",
        university: "КПІ",
        faculty: "ФІОТ",
        age: 18,
        courses: ["Backend", "Databases"],
        hobby: "Програмування",
        photo: "/images/sergiy.jpg",
        description: "Сергій з дитинства відчував, що програмування буде його шляхом. Він любить складні задачі та серверну розробку."
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/students', (req, res) => {
    res.render('students', { students });
});

app.get('/student/:slug', (req, res) => {
    const student = students.find(s => s.slug === req.params.slug);
    if (student) {
        res.render('student', { student, students });
    } else {
        res.status(404).send('Студента не знайдено');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});