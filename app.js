const placeholders = document.querySelectorAll(".placeholder");
const classes = ["start", "progress", "done"];

function dragItem(e) {
    if (!e.target.closest(".item")) return;
    e.target.classList.toggle("hold");
    setTimeout(() => e.target.classList.toggle("hide"), 0);
    placeholderHeight();
}

function dragOverPlaceholder(e) {
    let el = e.target.closest(".placeholder");
    if (!el) return;

    el.classList.toggle("hovered", !el.classList.contains("hovered"));
}

function drop(e) {
    let el = e.target.closest(".placeholder");
    if (!el) return;
    let item = document.querySelector(".hold");
    el.append(item);
    toggleProgress(el);
    el.classList.remove("hovered");
}

function toggleProgress(placeholder) {
    let i = Array.from(placeholders).findIndex(el => el === placeholder);
    placeholder.querySelectorAll(".item").forEach(el => {
        el.classList.remove(...classes);
        el.classList.add(classes[i]);
    });
}

function placeholderHeight() {
    placeholders.forEach(el => {
        let countItems = el.querySelectorAll(".item:not(.hold)").length;
        el.style.height = `${ (countItems) * 74 + 66 }px`;
    });
}

document.addEventListener("dragstart", dragItem);
document.addEventListener("dragend", dragItem);
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("dragenter", dragOverPlaceholder);
document.addEventListener("dragleave", dragOverPlaceholder);
document.addEventListener("drop", drop);
placeholderHeight();