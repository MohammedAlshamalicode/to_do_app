document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const filterSelect = document.getElementById("filter");

    let tasks = [];

    // ✅ تحميل المهام من الـ backend
    function fetchTasks() {
        fetch("http://localhost:8080/todo")
            .then(res => res.json())
            .then(data => {
                tasks = data;
                renderTasks();
            })
            .catch(err => console.error("Error fetching tasks:", err));
    }

    // ✅ عرض المهام في الصفحة
    function renderTasks() {
        todoList.innerHTML = "";

        const filter = filterSelect.value;

        tasks
            .filter(task => {
                if (filter === "completed") return task.completed;
                if (filter === "not-completed") return !task.completed;
                return true;
            })
            .forEach(task => {
                const li = document.createElement("li");
                li.className = "todo-item";

                const span = document.createElement("span");
                span.className = "task-text";
                span.textContent = task.task;
                if (task.completed) {
                    span.style.textDecoration = "line-through";
                }

                const actions = document.createElement("div");
                actions.className = "actions";

                // ✅ checkbox لتحديث completed
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.addEventListener("change", () => {
                    fetch(`http://localhost:8080/todo/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ completed: checkbox.checked })
                    }).then(fetchTasks);
                });

                // 🗑️ زر الحذف
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "🗑";
                deleteBtn.addEventListener("click", () => {
                    fetch(`http://localhost:8080/todo/${task.id}`, {
                        method: "DELETE"
                    }).then(fetchTasks);
                });

                actions.appendChild(checkbox);
                actions.appendChild(deleteBtn);

                li.appendChild(span);
                li.appendChild(actions);
                todoList.appendChild(li);
            });
    }

    // ➕ إضافة مهمة جديدة
    addButton.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text === "") return;

        fetch("http://localhost:8080/todo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: text })
        })
            .then(() => {
                taskInput.value = "";
                fetchTasks();
            });
    });

    // 🔁 فلترة المهام
    filterSelect.addEventListener("change", renderTasks);

    // 🚀 تحميل المهام عند فتح الصفحة
    fetchTasks();
});


// const ball = document.getElementById("ball");
//
// let direction = 1;
// let position = 0;
//
// function animate() {
//     position += direction * 2;
//
//     // عكس الاتجاه عند الوصول للحافة
//     if (position > window.innerWidth - 60 || position < 0) {
//         direction *= -1;
//     }
//
//     ball.style.left = position + "px";
//     requestAnimationFrame(animate); // استمرار الحركة
// }
//
// animate(); // بداية التحريك


function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

function loadWeather(lat, lon) {
    const API_KEY = "7bedc3f0adcea373813f448a3014acd0"; // 🔑 ضع مفتاحك هنا إذا تغير
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const city = data.name;
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            document.getElementById("weather").innerHTML = `
                <img src="${iconUrl}" alt="${desc}">
                <span>${city} | ${temp}°C | ${desc}</span>
            `;
        })
        .catch(() => {
            document.getElementById("weather").textContent = "Weather data unavailable.";
        });
}

function detectLocationAndLoadWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                loadWeather(latitude, longitude);
            },
            error => {
                document.getElementById("weather").textContent = "Location access denied.";
            }
        );
    } else {
        document.getElementById("weather").textContent = "Geolocation not supported.";
    }
}

detectLocationAndLoadWeather();

