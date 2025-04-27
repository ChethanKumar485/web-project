// User database (in a real app, this would be a proper database)
let users = JSON.parse(localStorage.getItem('deepguard-users')) || [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('deepguard-currentUser'));
    
    // On main app page
    if (document.getElementById('user-info')) {
        if (currentUser) {
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('username-display').textContent = `Welcome, ${currentUser.username}`;
            
            document.getElementById('logout-btn').addEventListener('click', function() {
                sessionStorage.removeItem('deepguard-currentUser');
                window.location.href = 'login.html';
            });
        }
    }
    
    // On login page
    if (document.getElementById('login-form')) {
        const loginForm = document.getElementById('login-form');
        const loginUsername = document.getElementById('login-username');
        const loginPassword = document.getElementById('login-password');
        const usernameError = document.getElementById('username-error');
        const passwordError = document.getElementById('password-error');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            usernameError.textContent = '';
            passwordError.textContent = '';
            
            const username = loginUsername.value.trim();
            const password = loginPassword.value;
            
            // Validate
            let isValid = true;
            
            if (!username) {
                usernameError.textContent = 'Username is required';
                isValid = false;
            }
            
            if (!password) {
                passwordError.textContent = 'Password is required';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Check if user exists
            const user = users.find(u => u.username === username);
            
            if (!user) {
                usernameError.textContent = 'Username not found';
                return;
            }
            
            // Check password (in real app, this would be hashed)
            if (user.password !== password) {
                passwordError.textContent = 'Incorrect password';
                return;
            }
            
            // Login successful
            sessionStorage.setItem('deepguard-currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        });
    }
    
    // On registration page
    if (document.getElementById('register-form')) {
        const registerForm = document.getElementById('register-form');
        const registerUsername = document.getElementById('register-username');
        const registerPassword = document.getElementById('register-password');
        const confirmPassword = document.getElementById('confirm-password');
        const regUsernameError = document.getElementById('username-error');
        const regPasswordError = document.getElementById('password-error');
        const confirmError = document.getElementById('confirm-error');

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            regUsernameError.textContent = '';
            regPasswordError.textContent = '';
            confirmError.textContent = '';
            
            const username = registerUsername.value.trim();
            const password = registerPassword.value;
            const confirm = confirmPassword.value;
            
            // Validate
            let isValid = true;
            
            if (!username) {
                regUsernameError.textContent = 'Username is required';
                isValid = false;
            } else if (username.length < 3) {
                regUsernameError.textContent = 'Username must be at least 3 characters';
                isValid = false;
            } else if (users.some(u => u.username === username)) {
                regUsernameError.textContent = 'Username already exists';
                isValid = false;
            }
            
            if (!password) {
                regPasswordError.textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 8) {
                regPasswordError.textContent = 'Password must be at least 8 characters';
                isValid = false;
            }
            
            if (password !== confirm) {
                confirmError.textContent = 'Passwords do not match';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Create new user (in real app, password would be hashed)
            const newUser = {
                username,
                password,
                joined: new Date().toISOString(),
                analyses: []
            };
            
            users.push(newUser);
            localStorage.setItem('deepguard-users', JSON.stringify(users));
            
            // Auto-login and redirect
            sessionStorage.setItem('deepguard-currentUser', JSON.stringify(newUser));
            window.location.href = 'index.html';
        });
    }
});