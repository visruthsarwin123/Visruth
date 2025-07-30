function loginUser(e) {
  e.preventDefault();
  // Store name and email from login form
  const name = document.getElementById('loginName').value;
  const email = document.getElementById('loginEmail').value;
  localStorage.setItem('signedUpName', name);
  localStorage.setItem('signedUpEmail', email);
  // For demo: always "log in" and redirect
  window.location.href = "dashboard.html";
  return false;
}
// Store name on sign up
function signupUser(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  localStorage.setItem('signedUpName', name);
  showLoginForm();
  return false;
}

function showLoginForm() {
  document.querySelector('.right-panel form').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  // Show the name entered during sign up
  const name = localStorage.getItem('signedUpName');
  const nameDisplay = document.getElementById('loginNameDisplay');
  if (name && nameDisplay) {
    nameDisplay.textContent = 'Welcome, ' + name + '!';
    nameDisplay.style.display = 'block';
  } else if (nameDisplay) {
    nameDisplay.textContent = '';
    nameDisplay.style.display = 'none';
  }
}

function showSignupForm() {
  document.querySelector('.right-panel form').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  // Hide name display when switching to signup
  const nameDisplay = document.getElementById('loginNameDisplay');
  if (nameDisplay) {
    nameDisplay.textContent = '';
    nameDisplay.style.display = 'none';
  }
} 