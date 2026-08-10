const STORAGE_KEY = "lostItems";
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const TitleValue = document.getElementById("Title").value.trim();
    const NameValue = document.getElementById("Name").value.trim();
    const RoomValue = document.getElementById("room").value.trim();
    const StudentIdValue = document.getElementById("studentId").value.trim();
    const DescValue = document.getElementById("desc").value.trim();
    const DateValue = document.getElementById("date").value;
    const TimeValue = document.getElementById("time").value;
    const formData = {
        title: TitleValue,
        name: NameValue,
        room: RoomValue,
        studentId: StudentIdValue,
        desc: DescValue,
        date: DateValue,
        time: TimeValue,
    };
    const oldData = localStorage.getItem(STORAGE_KEY);
    const formArray = oldData ? JSON.parse(oldData) : [];
    formArray.unshift(formData);
    if (formArray.length > 20) {
        formArray.pop();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formArray));
    CreateCard(formData, true);
    document.getElementById("form").reset();
});
function formatDateTime(dateStr, timeStr) {
    if (!dateStr) return "";
    const dateObj = new Date(`${dateStr}T${timeStr || "00:00"}`);
    const datePart = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    if (!timeStr) return `Lost on ${datePart}`;
    const timePart = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    return `Lost on ${datePart} at ${timePart}`;
}

function CreateCard(data, prepend = false) {
    const html = `<div class="card">
            <div id="text">
                <h1>${data.title}</h1>
                 <p><strong>Reported by:</strong> ${data.name} (ID: ${data.studentId}) &middot; Room ${data.room}</p>
                <p class="card-desc">${data.desc}</p>
                <p class="card-meta">${formatDateTime(data.date, data.time)}</p>
            </div>
        </div>`;

    const list = document.getElementById("cardsList");
    if (prepend) {
        list.insertAdjacentHTML("afterbegin", html);
    } else {
        list.insertAdjacentHTML("beforeend", html);
    }
}

function renderSavedCards() {
    const oldData = localStorage.getItem(STORAGE_KEY);
    if (!oldData) return;
    const formArray = JSON.parse(oldData);
    formArray.forEach((item) => CreateCard(item, false));
}

document.addEventListener("DOMContentLoaded", renderSavedCards);