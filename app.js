
let data = [];
let currentTicket = 0;
let currentTask = 0;
let answerVisible = false;

fetch("./data.json")
  .then(res => {
    if (!res.ok) {
      throw new Error(`Ошибка загрузки data.json: ${res.status}`);
    }
    return res.json();
  })
  .then(json => {
    data = json;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("data.json не содержит билетов");
    }

    render();
  })
  .catch(error => {
    console.error("Ошибка загрузки приложения:", error);
    document.getElementById("title").innerText =
      "Ошибка загрузки заданий. Проверьте data.json.";
  });

function render() {
  const ticket = data[currentTicket];

  if (!ticket || !Array.isArray(ticket.tasks) ||
      ticket.tasks.length === 0) {
    document.getElementById("title").innerText =
      "Нет доступных заданий";
    document.getElementById("text").innerHTML = "";
    document.getElementById("taskBox").innerHTML = "";
    return;
  }

  const task = ticket.tasks[currentTask];

  // TITLE
  document.getElementById("title").innerText = ticket.title;

  // TEXT
  const textBox = document.getElementById("text");
  textBox.innerHTML = "";

  ticket.text.forEach(t => {
    textBox.innerHTML += `<p><b>${t.de}</b><br>${t.ru}</p>`;
  });

  // TASK
  const taskBox = document.getElementById("taskBox");

  let html = `<div class="task">`;

  html += `
    <p><b>${task.number}.</b> ${task.question_de}</p>
    <p>${task.question_ru}</p>
  `;

  // TRUE / FALSE
  if (task.type === "truefalse") {
    html += `
      <p><b>Antwort:</b> ${
        answerVisible ? task.answer.toUpperCase() : "•••"
      }</p>
    `;
  }

  // ABC
  if (task.type === "abc") {
    const correct = task.answer;
    const opt = task.options[correct];

    html += `
      <p><b>Richtige Antwort:</b> ${
        answerVisible ? correct.toUpperCase() + ") " + opt.de : "•••"
      }</p>

      <p><small>${answerVisible ? opt.ru : ""}</small></p>
    `;
  }

  html += `</div>`;
  taskBox.innerHTML = html;

  document.getElementById("openAnswer").innerText =
    answerVisible ? "Скрыть" : "Открыть";
}

/* =========================
   ОТВЕТ
========================= */
document.getElementById("openAnswer").onclick = () => {
  answerVisible = !answerVisible;
  render();
};

/* =========================
   NEXT (ВПЕРЁД)
========================= */
document.getElementById("next").onclick = () => {
  const ticket = data[currentTicket];

  if (currentTask < ticket.tasks.length - 1) {
    currentTask++;
  } else if (currentTicket < data.length - 1) {
    currentTicket++;
    currentTask = 0;
  }

  answerVisible = false;
  render();
};

/* =========================
   PREV (НАЗАД)
========================= */
document.getElementById("prev").onclick = () => {
  if (currentTask > 0) {
    currentTask--;
  } else if (currentTicket > 0) {
    currentTicket--;
    currentTask = data[currentTicket].tasks.length - 1;
  }

  answerVisible = false;
  render();
};

/* =========================
   HOME (В НАЧАЛО)
========================= */
document.getElementById("home").onclick = () => {
  currentTicket = 0;
  currentTask = 0;
  answerVisible = false;
  render();
};

/* =========================
   END (В КОНЕЦ)
========================= */
document.getElementById("end").onclick = () => {
  if (data.length === 0) return;

  currentTicket = data.length - 1;
  currentTask = data[currentTicket].tasks.length - 1;
  answerVisible = false;
  render();
};
