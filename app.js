document.write(`
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * {
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3s ease;
  }
  body {
    margin: 0;
    background: #0f0f0f;
    color: #f1f1f1;
    padding: 1rem;
  }
  h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2rem;
    color: #00ffff;
    text-align: center;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #1c1c1c;
    border-radius: 8px;
    overflow: hidden;
  }
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  th {
    background: #222;
    color: #0ff;
  }
  tr:hover {
    background-color: #292929;
  }
  .icon {
    margin-right: 8px;
  }
  .file-name {
    color: #fff;
    font-weight: 500;
    text-decoration: none;
  }
  .file-name:hover {
    color: #0ff;
    text-decoration: underline;
  }
  .footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.9rem;
    color: #888;
  }
  @media (max-width: 600px) {
    table, thead, tbody, th, td, tr {
      display: block;
    }
    tr {
      margin-bottom: 1rem;
    }
    th {
      display: none;
    }
    td {
      padding: 0.5rem;
      text-align: right;
      position: relative;
    }
    td::before {
      content: attr(data-label);
      float: left;
      text-transform: uppercase;
      color: #888;
      font-weight: bold;
    }
  }
</style>

<h1>🚀 ${document.title}</h1>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Size</th>
      <th>Created</th>
      <th>Modified</th>
    </tr>
  </thead>
  <tbody id="file-list">
    <!-- Files will be loaded here -->
  </tbody>
</table>
<div class="footer">🌌 Powered by PlayBoy.kl</div>
`);

window.onload = function () {
  if (!window.MODEL || !window.MODEL.data) return;
  const files = window.MODEL.data.files || [];
  const tbody = document.getElementById("file-list");

  files.forEach(file => {
    const tr = document.createElement("tr");
    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
    const icon = isFolder ? "📁" : "📄";
    const size = file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "-";
    const created = file.createdTime ? new Date(file.createdTime).toLocaleDateString() : "-";
    const modified = file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : "-";
    const link = isFolder ? `${file.name}/` : `?a=view&file=${file.name}`;

    tr.innerHTML = \`
      <td data-label="Name"><a class="file-name" href="\${link}">\${icon} \${file.name}</a></td>
      <td data-label="Type">\${isFolder ? "Folder" : (file.mimeType.split('/').pop())}</td>
      <td data-label="Size">\${size}</td>
      <td data-label="Created">\${created}</td>
      <td data-label="Modified">\${modified}</td>
    \`;
    tbody.appendChild(tr);
  });
};
