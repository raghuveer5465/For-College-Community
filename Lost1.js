const STORAGE_KEY = "lostItems";
const RESOLVED_KEY = "lostItems_resolved_count";

let uploadedImageData = "";

// Image Preview & Base64 Converter
document.getElementById("itemImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            uploadedImageData = event.target.result;
            document.getElementById("imagePreview").src = uploadedImageData;
            document.getElementById("imagePreviewContainer").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Toast System
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Custom Modal Promise
function showModal(title, message, isAlert = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById("customModal");
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalMessage").innerText = message;
        const cancelBtn = document.getElementById("modalCancelBtn");
        const confirmBtn = document.getElementById("modalConfirmBtn");

        cancelBtn.style.display = isAlert ? "none" : "inline-block";
        confirmBtn.innerText = isAlert ? "OK" : "Confirm";

        modal.classList.add("active");

        const handleConfirm = () => { cleanup(); resolve(true); };
        const handleCancel = () => { cleanup(); resolve(false); };

        function cleanup() {
            modal.classList.remove("active");
            confirmBtn.removeEventListener("click", handleConfirm);
            cancelBtn.removeEventListener("click", handleCancel);
        }

        confirmBtn.addEventListener("click", handleConfirm);
        cancelBtn.addEventListener("click", handleCancel);
    });
}

// Form Submit Event
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
        id: Date.now(),
        title: document.getElementById("Title").value.trim(),
        category: document.getElementById("category").value,
        name: document.getElementById("Name").value.trim(),
        room: document.getElementById("room").value.trim(),
        studentId: document.getElementById("studentId").value.trim(),
        desc: document.getElementById("desc").value.trim(),
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        image: uploadedImageData
    };

    const oldData = localStorage.getItem(STORAGE_KEY);
    const formArray = oldData ? JSON.parse(oldData) : [];
    formArray.unshift(formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formArray));

    // Reset Form
    document.getElementById("form").reset();
    document.getElementById("imagePreviewContainer").style.display = "none";
    uploadedImageData = "";

    showToast("Lost item report published!");
    renderSavedCards();
});

function formatDateTime(dateStr, timeStr) {
    if (!dateStr) return "";
    const dateObj = new Date(`${dateStr}T${timeStr || "00:00"}`);
    const datePart = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timePart = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `Lost on ${datePart} at ${timePart}`;
}

function CreateCard(data) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div id="text">
            <div class="card-header-flex">
                <div>
                    <span class="card-badge">${data.category || 'General'}</span>
                    <h1>${data.title}</h1>
                </div>
                <div class="card-actions">
                    <button class="delete-btn">Delete</button>
                    <button class="resolve-btn">Found!</button>
                </div>
            </div>
            ${data.image ? `<img src="${data.image}" class="card-image-attach" alt="Item Photo">` : ''}
            <p><strong>Reported by:</strong> ${data.name}</p>
            <p class="card-desc">${data.desc}</p>
            <p class="card-meta">${formatDateTime(data.date, data.time)}</p>
            <button class="contact-btn">📞 Contact Owner</button>
        </div>
    `;

    // Contact Modal
    card.querySelector(".contact-btn").addEventListener("click", () => {
        showModal(`Contact ${data.name}`, `Room Location: ${data.room}\nStudent ID: ${data.studentId}`, true);
    });

    // Delete Event
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        const confirmed = await showModal("Delete Report", "Are you sure you want to remove this lost item report?");
        if (confirmed) {
            deleteCard(data.id);
            showToast("Report deleted", "danger");
        }
    });

    // Resolve Event
    card.querySelector(".resolve-btn").addEventListener("click", async () => {
        const confirmed = await showModal("Item Found", "Mark this lost item as found?");
        if (confirmed) {
            card.classList.add("resolved");
            let resCount = parseInt(localStorage.getItem(RESOLVED_KEY) || "0") + 1;
            localStorage.setItem(RESOLVED_KEY, resCount.toString());

            showToast("Awesome! Item marked as found 🎉");
            setTimeout(() => deleteCard(data.id), 1500);
        }
    });

    document.getElementById("cardsList").appendChild(card);
}

function deleteCard(id) {
    const oldData = localStorage.getItem(STORAGE_KEY);
    if (!oldData) return;
    let formArray = JSON.parse(oldData).filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formArray));
    renderSavedCards();
}

function renderSavedCards() {
    const list = document.getElementById("cardsList");
    list.innerHTML = "";

    const oldData = localStorage.getItem(STORAGE_KEY);
    let formArray = oldData ? JSON.parse(oldData) : [];

    // Filter Logic
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const categoryValue = document.getElementById("categoryFilter").value;
    const sortValue = document.getElementById("sortOrder").value;

    formArray = formArray.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchValue) || item.desc.toLowerCase().includes(searchValue);
        const matchesCategory = categoryValue === "All" || item.category === categoryValue;
        return matchesSearch && matchesCategory;
    });

    if (sortValue === "oldest") formArray.reverse();

    // Update Stats
    document.getElementById("statTotal").innerText = formArray.length;
    document.getElementById("statResolved").innerText = localStorage.getItem(RESOLVED_KEY) || "0";

    formArray.forEach(item => CreateCard(item));
}

// Search & Filter Listeners
document.getElementById("searchInput").addEventListener("input", renderSavedCards);
document.getElementById("categoryFilter").addEventListener("change", renderSavedCards);
document.getElementById("sortOrder").addEventListener("change", renderSavedCards);

document.addEventListener("DOMContentLoaded", renderSavedCards);
