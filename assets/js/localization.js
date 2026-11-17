const ticketLabels = {
  "Billing & Account": "Оплата и аккаунт",
  "Feature Request": "Запрос на доработку",
  "General Support": "Общие вопросы",
  "Technical Issue": "Техническая проблема",
  "In Progress": "В работе",
  Pending: "Ожидает ответа",
  Solved: "Решено",
};

const demoDateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const chatStatuses = { online: "в сети", offline: "не в сети", busy: "занят" };

document.addEventListener("alpine:init", () => {
  Alpine.magic("ticketLabel", () => label => ticketLabels[label] ?? label);
  Alpine.magic("chatStatus", () => status => chatStatuses[status] ?? status);
  Alpine.magic("demoDate", () => value => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : demoDateFormat.format(date);
  });
});
