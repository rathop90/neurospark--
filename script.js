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

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Load Books on Page Load
document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
    checkAdmin();
});

// ✅ Load Books from Firebase
function loadBooks() {
    let bookList = document.getElementById("book-list");
    let booksRef = db.ref("books/");

    booksRef.once("value", (snapshot) => {
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

// ✅ Upload Book (Admin Only)
function uploadBook() {
    let fileInput = document.getElementById("book-upload");
    if (fileInput.files.length === 0) {
        alert("Please select a file!");
        return;
    }

    let fileName = fileInput.files[0].name;
    let bookId = Date.now().toString();

    db.ref("books/" + bookId).set(fileName).then(() => {
        loadBooks();
    });
}

// ✅ Delete Book (Admin Only)
function deleteBook(bookId) {
    db.ref("books/" + bookId).remove().then(() => {
        loadBooks();
    });
}

// ✅ Admin Login (Now Works)
document.getElementById("login-btn").addEventListener("click", function () {
    let password = prompt("Enter Admin Password:");
    if (password === "051085") {
        localStorage.setItem("admin", "true");
        alert("Admin Mode Activated!");
        checkAdmin();
        loadBooks();
    } else {
        alert("Wrong Password!");
    }
});

// ✅ Admin Logout
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("admin");
    alert("Admin Mode Deactivated!");
    checkAdmin();
    loadBooks();
});

// ✅ Check Admin Mode
function checkAdmin() {
    let isAdmin = localStorage.getItem("admin") === "true";
    document.getElementById("admin-section").style.display = isAdmin ? "block" : "none";
    document.getElementById("logout-btn").style.display = isAdmin ? "inline-block" : "none";
    document.getElementById("login-btn").style.display = isAdmin ? "none" : "inline-block";
}
