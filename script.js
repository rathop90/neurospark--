// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAr0Zs5gXrX7P7Vb_3OHMom3e2cjszFC2k",
    authDomain: "neurospark-34d4c.firebaseapp.com",
    databaseURL: "https://neurospark-34d4c-default-rtdb.firebaseio.com",
    projectId: "neurospark-34d4c",
    storageBucket: "neurospark-34d4c.firebasestorage.app",
    messagingSenderId: "16936570218",
    appId: "1:16936570218:web:3fc676530ace108e6f6913"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
    checkAdmin();
});

// ✅ Load Books from Firebase
function loadBooks() {
    let bookList = document.getElementById("book-list");
    let booksRef = ref(db, "books/");

    get(booksRef).then((snapshot) => {
        if (snapshot.exists()) {
            let books = snapshot.val();
            bookList.innerHTML = "";
            Object.keys(books).forEach((key) => {
                let bookDiv = document.createElement("div");
                bookDiv.classList.add("book");
                bookDiv.innerHTML = `<p>${books[key]}</p>` + 
                    (localStorage.getItem("admin") === "true" ? `<button onclick="deleteBook('${key}')">❌ Delete</button>` : "");
                bookList.appendChild(bookDiv);
            });
        }
    });
}

// ✅ Upload Books to Firebase
function uploadBook() {
    let fileInput = document.getElementById("book-upload");
    if (fileInput.files.length === 0) {
        alert("Please select a file!");
        return;
    }

    let fileName = fileInput.files[0].name;
    let bookId = Date.now().toString();

    set(ref(db, "books/" + bookId), fileName).then(() => {
        loadBooks();
    });
}

// ✅ Delete Book (Admin Only)
function deleteBook(bookId) {
    remove(ref(db, "books/" + bookId)).then(() => {
        loadBooks();
    });
}

// ✅ Admin Login
function adminLogin() {
    let password = prompt("Enter Admin Password:");
    if (password === "051085") {
        localStorage.setItem("admin", "true");
        alert("Admin Mode Activated!");
        checkAdmin();
        loadBooks();
    } else {
        alert("Wrong Password!");
    }
}

// ✅ Admin Logout
function adminLogout() {
    localStorage.removeItem("admin");
    alert("Admin Mode Deactivated!");
    checkAdmin();
    loadBooks();
}

// ✅ Check Admin Mode
function checkAdmin() {
    let isAdmin = localStorage.getItem("admin") === "true";
    document.getElementById("admin-section").style.display = isAdmin ? "block" : "none";
    document.getElementById("logout-btn").style.display = isAdmin ? "inline-block" : "none";
    document.getElementById("login-btn").style.display = isAdmin ? "none" : "inline-block";
}
