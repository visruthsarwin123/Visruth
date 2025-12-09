// Mock authentication
function login() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (email && password) {
    localStorage.setItem('nexaUser', JSON.stringify({ name, email }));
    window.location.href = 'dashboard.html';
  } else {
    alert('Please enter email and password.');
  }
}
function signup() {
  alert('Sign up is mocked for MVP. Use the login form!');
}
// Gin login function
function loginGin() {
  const name = document.getElementById('gin-name').value;
  const password = document.getElementById('gin-password').value;
  if (!name || !password) {
    alert('Please enter your name and password.');
    return;
  }
  localStorage.setItem('nexaUser', JSON.stringify({ name }));
  window.location.href = 'dashboard.html';
}
// Dashboard greeting (update to use gin login as well)
if (window.location.pathname.endsWith('dashboard.html')) {
  const user = JSON.parse(localStorage.getItem('nexaUser') || '{}');
  document.getElementById('user-name').textContent = user.name || 'User';
}
// Resume upload with dummy ATS feedback
function uploadResume() {
  const fileInput = document.getElementById('resume-file');
  const feedback = document.getElementById('ats-feedback');
  const suggestions = document.getElementById('resume-suggestions');
  const extraBtn = document.getElementById('extra-suggestion-btn');
  const extraSection = document.getElementById('extra-suggestion-section');
  suggestions.innerHTML = '';
  extraBtn.style.display = 'none';
  extraSection.style.display = 'none';
  if (fileInput.files.length === 0) {
    feedback.textContent = 'Please select a file to upload.';
    return;
  }
  const file = fileInput.files[0];
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    // PDF handling
    const reader = new FileReader();
    reader.onload = function(e) {
      const typedarray = new Uint8Array(e.target.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        let textContent = '';
        let pagePromises = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          pagePromises.push(
            pdf.getPage(i).then(function(page) {
              return page.getTextContent().then(function(text) {
                return text.items.map(item => item.str).join(' ');
              });
            })
          );
        }
        Promise.all(pagePromises).then(function(pagesText) {
          textContent = pagesText.join(' ');
          analyzeResumeText(textContent, feedback, suggestions, extraBtn);
        });
      });
    };
    reader.readAsArrayBuffer(file);
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    // TXT handling
    const reader = new FileReader();
    reader.onload = function(e) {
      analyzeResumeText(e.target.result, feedback, suggestions, extraBtn);
    };
    reader.readAsText(file);
  } else {
    feedback.textContent = 'Only .txt or .pdf files are supported for analysis.';
    return;
  }
}
function analyzeResumeText(content, feedback, suggestions, extraBtn) {
  let score = 80;
  let found = [];
  let missing = [];
  if (/summary/i.test(content)) { found.push('Summary'); score += 5; } else { missing.push('Add a professional summary at the top.'); }
  if (/skills/i.test(content)) { found.push('Skills'); score += 5; } else { missing.push('Include a Skills section.'); }
  if (/experience/i.test(content)) { found.push('Experience'); score += 5; } else { missing.push('Add your work experience.'); }
  if (/education/i.test(content)) { found.push('Education'); score += 5; } else { missing.push('Add your education details.'); }
  if (/\d{4}/.test(content)) { score += 2; }
  feedback.innerHTML = `<strong>ATS Score:</strong> ${score}/100<br>` +
    (found.length ? `Sections found: ${found.join(', ')}.<br>` : '') +
    (missing.length ? 'Suggestions below:' : 'Great job!');
  missing.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    suggestions.appendChild(li);
  });
  extraBtn.style.display = 'block';
}
function showExtraSuggestions() {
  const fileInput = document.getElementById('resume-file');
  const extraSection = document.getElementById('extra-suggestion-section');
  const extraList = document.getElementById('extra-suggestions');
  extraSection.style.display = 'block';
  extraList.innerHTML = '';
  // Try to get the last uploaded file's content for analysis
  if (fileInput.files.length === 0) {
    extraList.innerHTML = '<li>Please upload your resume first.</li>';
    return;
  }
  const file = fileInput.files[0];
  const processContent = (content) => {
    const extra = [];
    if (!/certification|certifications/i.test(content)) extra.push('Highlight certifications or courses.');
    if (!/portfolio|linkedin/i.test(content)) extra.push('Add links to your portfolio or LinkedIn.');
    if (!/leadership|project lead|team lead/i.test(content)) extra.push('Mention any leadership or project lead experience.');
    if (!/action verb|managed|developed|created|led|designed/i.test(content)) extra.push('Use action verbs to start bullet points.');
    if (!/one page|single page|1 page/i.test(content) && content.length > 2000) extra.push('Keep your resume to one page if possible.');
    // If all present, show a default message
    if (extra.length === 0) extra.push('Your resume covers all extra suggestions!');
    extra.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e;
      extraList.appendChild(li);
    });
    document.getElementById('extra-suggestion-btn').style.display = 'none';
  };
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const typedarray = new Uint8Array(e.target.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        let textContent = '';
        let pagePromises = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          pagePromises.push(
            pdf.getPage(i).then(function(page) {
              return page.getTextContent().then(function(text) {
                return text.items.map(item => item.str).join(' ');
              });
            })
          );
        }
        Promise.all(pagePromises).then(function(pagesText) {
          textContent = pagesText.join(' ');
          processContent(textContent);
        });
      });
    };
    reader.readAsArrayBuffer(file);
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      processContent(e.target.result);
    };
    reader.readAsText(file);
  } else {
    extraList.innerHTML = '<li>Only .txt or .pdf files are supported for extra suggestions.</li>';
  }
}
// Chatbot with static answers
const staticAnswers = {
  'hello': 'Hello! How can I help you with your career today?',
  'resume': 'Make sure your resume is tailored to the job description and includes relevant keywords.',
  'interview': 'Practice common interview questions and research the company beforehand.',
  'default': 'I am here to help! Try asking about resumes, interviews, or job search tips.'
};
function sendMessage() {
  const input = document.getElementById('chat-input');
  const chatWindow = document.getElementById('chat-window');
  const userMsg = input.value.trim();
  if (!userMsg) return;
  const userDiv = document.createElement('div');
  userDiv.textContent = 'You: ' + userMsg;
  chatWindow.appendChild(userDiv);
  let answer = staticAnswers['default'];
  Object.keys(staticAnswers).forEach(key => {
    if (userMsg.toLowerCase().includes(key)) {
      answer = staticAnswers[key];
    }
  });
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.textContent = 'Bot: ' + answer;
    chatWindow.appendChild(botDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 500);
  input.value = '';
}
// Resource list filtering
const resources = {
  tech: [
    { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
    { name: 'LeetCode', url: 'https://leetcode.com/' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' }
  ],
  business: [
    { name: 'Harvard Business Review', url: 'https://hbr.org/' },
    { name: 'Coursera Business', url: 'https://www.coursera.org/browse/business' }
  ],
  design: [
    { name: 'Dribbble', url: 'https://dribbble.com/' },
    { name: 'Behance', url: 'https://www.behance.net/' }
  ]
};
function showResources() {
  const domain = document.getElementById('domain-select').value;
  const list = document.getElementById('resource-list');
  list.innerHTML = '';
  (resources[domain] || []).forEach(res => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${res.url}" target="_blank">${res.name}</a>`;
    list.appendChild(li);
  });
}
if (window.location.pathname.endsWith('resources.html')) {
  document.addEventListener('DOMContentLoaded', showResources);
}
// Signup function
function signupUser() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (!name || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }
  localStorage.setItem('nexaUser', JSON.stringify({ name, email }));
  window.location.href = 'dashboard.html';
}
// Logout function
function logoutUser() {
  localStorage.removeItem('nexaUser');
  window.location.href = 'index.html';
} 