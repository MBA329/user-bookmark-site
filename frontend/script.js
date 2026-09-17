const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const loginContainer = document.getElementById('login-container');
const bookmarksContainer = document.getElementById('bookmarks-container');
const bookmarksList = document.getElementById('bookmarks-list');
const logoutButton = document.getElementById('logout-button');
const addBookmarkButton = document.getElementById('add-bookmark-button');
const newBookmarkUrlInput = document.getElementById('new-bookmark-url');

const API_BASE_URL = 'http://localhost:3000/api';

async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            credentials:"include",
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = data.message;
            loginMessage.style.color = 'green';
            showBookmarks();
        } else {
            loginMessage.textContent = data.error;
            loginMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        loginMessage.textContent = 'An error occurred during login.';
        loginMessage.style.color = 'red';
    }
}

async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        showLogin();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

async function getBookmarks() {
    try {
        const response = await fetch(`${API_BASE_URL}/bookmarks`, { credentials: 'include' });
        if (response.ok) {
            const bookmarks = await response.json();
            renderBookmarks(bookmarks);
        } else if (response.status === 401) {
            showLogin();
        }
         else {
            console.error('Error fetching bookmarks:', await response.text());
        }
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
}

async function addBookmark(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
            credentials: 'include'
        });

        if (response.ok) {
            newBookmarkUrlInput.value = '';
            getBookmarks();
        } else {
             console.error('Error adding bookmark:', await response.text());
        }
    } catch (error) {
        console.error('Error adding bookmark:', error);
    }
}

async function deleteBookmark(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            getBookmarks();
        } else {
             console.error('Error deleting bookmark:', await response.text());
        }
    } catch (error) {
        console.error('Error deleting bookmark:', error);
    }
}

function renderBookmarks(bookmarks) {
    bookmarksList.innerHTML = '';
    bookmarks.forEach(bookmark => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
            <div class="bookmark-actions">
                <button onclick="deleteBookmark('${bookmark.id}')">Delete</button>
            </div>
        `;
        bookmarksList.appendChild(li);
    });
}

function showLogin() {
    loginContainer.style.display = 'block';
    bookmarksContainer.style.display = 'none';
}

function showBookmarks() {
    loginContainer.style.display = 'none';
    bookmarksContainer.style.display = 'block';
    getBookmarks();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    login(username, password);
});

logoutButton.addEventListener('click', logout);

addBookmarkButton.addEventListener('click', () => {
    const url = newBookmarkUrlInput.value;
    if (url) {
        addBookmark(url);
    }
});

// Check if user is already logged in on page load
async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        if (response.ok) {
            showBookmarks();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

checkLoginStatus();
