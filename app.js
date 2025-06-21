// custom-app.js from scratch — modern UI for GoIndex with data.files fix

function formatFileSize(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + " MB";
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + " KB";
  if (bytes > 1) return bytes + " bytes";
  if (bytes === 1) return "1 byte";
  return "";
}

function utcToLocal(utc) {
  const date = new Date(utc);
  return date.toLocaleString();
}

function renderItem(path, item) {
  const isFolder = item.mimeType === "application/vnd.google-apps.folder";
  const icon = isFolder ? "📁" : "📄";
  const href = path + item.name + (isFolder ? "/" : "");
  const size = isFolder ? "" : formatFileSize(item.size);
  const modified = utcToLocal(item.modifiedTime);

  return `
    <div class="card ${isFolder ? 'folder' : 'file'}">
      <a href="${href}" class="card-link ${isFolder ? 'folder' : ''}">
        <div class="icon">${icon}</div>
        <div class="details">
          <div class="name">${item.name}</div>
          <div class="meta">
            ${size ? `<span>${size}</span>` : ''}
            <span>${modified}</span>
          </div>
        </div>
      </a>
    </div>
  `;
}

function renderPage(path, files) {
  const container = document.querySelector('.file-list');
  container.innerHTML = '';

  if (path !== '/') {
    const up = path.split('/').slice(0, -2).join('/') + '/';
    container.innerHTML += renderItem(up, { name: '..', mimeType: 'application/vnd.google-apps.folder' });
  }

  files.forEach(item => {
    container.innerHTML += renderItem(path, item);
  });
}

function fetchData(path) {
  const password = localStorage.getItem('password' + path);
  fetch(path, {
    method: 'POST',
    body: JSON.stringify({ password })
  })
    .then(res => res.text())
    .then(text => {
      const obj = JSON.parse(text);
      if (obj?.error?.code === '401') {
        const pass = prompt('🔒 Password Required:', '');
        if (pass) {
          localStorage.setItem('password' + path, pass);
          fetchData(path);
        } else {
          history.go(-1);
        }
      } else if (obj?.data?.files) {
        renderPage(path, obj.data.files);
      } else {
        document.querySelector(".file-list").innerHTML = "<p style='color:red;'>⚠️ Failed to load files</p>";
      }
    });
}

function navigate(path) {
  history.pushState(null, null, path);
  document.title = `${document.siteName} - ${decodeURI(path)}`;
  fetchData(path);
}

window.onpopstate = () => {
  fetchData(window.location.pathname);
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML += `
    <style>
      body {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        padding: 20px;
      }
      .site-header {
        font-size: 1.6rem;
        font-weight: bold;
        color: #4fc3f7;
        margin-bottom: 24px;
        text-align: center;
      }
      .file-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }
      .card {
        background: #1e1e1e;
        border-radius: 10px;
        padding: 16px;
        transition: background 0.3s, transform 0.2s;
      }
      .card:hover {
        background-color: #2a2a2a;
        transform: scale(1.02);
      }
      .card-link {
        display: flex;
        align-items: center;
        color: inherit;
        text-decoration: none;
      }
      .icon {
        font-size: 1.8rem;
        margin-right: 16px;
      }
      .details {
        display: flex;
        flex-direction: column;
      }
      .name {
        font-size: 1.1rem;
        font-weight: 500;
      }
      .meta {
        font-size: 0.85rem;
        color: #aaa;
      }
      .meta span + span {
        margin-left: 12px;
      }
    </style>
  `;

  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a.folder');
    if (link) {
      e.preventDefault();
      navigate(link.getAttribute('href'));
    }
  });

  fetchData(window.location.pathname);
});
