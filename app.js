<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern File Browser</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0f0f23;
            --bg-secondary: #1a1a2e;
            --bg-tertiary: #16213e;
            --accent-primary: #00f5ff;
            --accent-secondary: #ff006e;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --border-color: rgba(0, 245, 255, 0.2);
            --shadow-glow: 0 0 20px rgba(0, 245, 255, 0.3);
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Animated background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
            z-index: -1;
            animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(2deg); }
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(26, 26, 46, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            color: var(--text-secondary);
            position: relative;
            z-index: 1;
        }

        .breadcrumb-item {
            padding: 8px 16px;
            background: rgba(0, 245, 255, 0.1);
            border-radius: 20px;
            border: 1px solid rgba(0, 245, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .breadcrumb-item:hover {
            background: rgba(0, 245, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 245, 255, 0.3);
        }

        .file-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .file-table {
            background: rgba(26, 26, 46, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-glow);
        }

        .table-header {
            background: var(--gradient-primary);
            padding: 20px 30px;
            display: grid;
            grid-template-columns: 2fr 1fr 1.5fr 1fr;
            gap: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .file-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1.5fr 1fr;
            gap: 20px;
            padding: 20px 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .file-row::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.05), transparent);
            transition: left 0.5s ease;
        }

        .file-row:hover {
            background: rgba(0, 245, 255, 0.05);
            transform: translateX(5px);
        }

        .file-row:hover::before {
            left: 100%;
        }

        .file-name {
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 500;
        }

        .file-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            background: var(--gradient-accent);
            box-shadow: 0 4px 15px rgba(255, 0, 110, 0.3);
            transition: all 0.3s ease;
        }

        .file-row:hover .file-icon {
            transform: rotate(5deg) scale(1.1);
            box-shadow: 0 6px 20px rgba(255, 0, 110, 0.5);
        }

        .file-link {
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
        }

        .file-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background: var(--accent-primary);
            transition: width 0.3s ease;
        }

        .file-link:hover::after {
            width: 100%;
        }

        .file-size, .file-date, .file-type {
            color: var(--text-secondary);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 245, 255, 0.3);
            border-top: 3px solid var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .folder-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .file-icon-default { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .pdf-icon { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }
        .image-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .audio-icon { background: linear-gradient(135deg, #43c6ac 0%, #191654 100%); }
        .video-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .archive-icon { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .text-icon { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
        .html-icon { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }

        /* Responsive design */
        @media (max-width: 768px) {
            .file-table {
                margin: 0 -20px;
                border-radius: 0;
            }
            
            .file-row {
                grid-template-columns: 1fr;
                gap: 10px;
                padding: 15px 20px;
            }
            
            .table-header {
                display: none;
            }
            
            .file-size, .file-date, .file-type {
                font-size: 0.8rem;
            }
        }

        /* Scroll animations */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-secondary);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 id="heading">Index of /</h1>
            <div class="breadcrumb" id="breadcrumb">
                <div class="breadcrumb-item">Home</div>
            </div>
        </div>
        
        <div class="file-table">
            <div class="table-header">
                <div>Name</div>
                <div>Size</div>
                <div>Modified</div>
                <div>Type</div>
            </div>
            <div id="file-list">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Mock data for demonstration
        const mockFiles = [
            {
                name: 'Documents',
                type: 'folder',
                size: '',
                modified: '2024-06-20 14:30',
                mimeType: 'application/vnd.google-apps.folder'
            },
            {
                name: 'Images',
                type: 'folder',
                size: '',
                modified: '2024-06-19 10:15',
                mimeType: 'application/vnd.google-apps.folder'
            },
            {
                name: 'report.pdf',
                type: 'file',
                size: '2.5 MB',
                modified: '2024-06-21 09:45',
                mimeType: 'application/pdf'
            },
            {
                name: 'photo.jpg',
                type: 'file',
                size: '1.8 MB',
                modified: '2024-06-20 16:20',
                mimeType: 'image/jpeg'
            },
            {
                name: 'music.mp3',
                type: 'file',
                size: '4.2 MB',
                modified: '2024-06-18 12:00',
                mimeType: 'audio/mpeg'
            },
            {
                name: 'video.mp4',
                type: 'file',
                size: '15.7 MB',
                modified: '2024-06-17 08:30',
                mimeType: 'video/mp4'
            },
            {
                name: 'archive.zip',
                type: 'file',
                size: '890 KB',
                modified: '2024-06-16 14:45',
                mimeType: 'application/zip'
            },
            {
                name: 'readme.txt',
                type: 'file',
                size: '2.1 KB',
                modified: '2024-06-15 11:20',
                mimeType: 'text/plain'
            },
            {
                name: 'index.html',
                type: 'file',
                size: '5.6 KB',
                modified: '2024-06-14 15:30',
                mimeType: 'text/html'
            }
        ];

        function getFileIcon(mimeType, type) {
            if (type === 'folder') return '📁';
            
            const iconMap = {
                'application/pdf': '📄',
                'image/jpeg': '🖼️',
                'image/png': '🖼️',
                'audio/mpeg': '🎵',
                'audio/wav': '🎵',
                'video/mp4': '🎬',
                'video/mpeg': '🎬',
                'application/zip': '📦',
                'application/x-zip-compressed': '📦',
                'text/plain': '📝',
                'text/html': '🌐',
                'text/markdown': '📋'
            };
            
            return iconMap[mimeType] || '📄';
        }

        function getIconClass(mimeType, type) {
            if (type === 'folder') return 'folder-icon';
            
            if (mimeType.startsWith('image/')) return 'image-icon';
            if (mimeType.startsWith('audio/')) return 'audio-icon';
            if (mimeType.startsWith('video/')) return 'video-icon';
            if (mimeType.includes('pdf')) return 'pdf-icon';
            if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive-icon';
            if (mimeType.startsWith('text/')) return 'text-icon';
            if (mimeType.includes('html')) return 'html-icon';
            
            return 'file-icon-default';
        }

        function renderFiles(files) {
            const fileList = document.getElementById('file-list');
            
            setTimeout(() => {
                let html = '';
                
                files.forEach((file, index) => {
                    const icon = getFileIcon(file.mimeType, file.type);
                    const iconClass = getIconClass(file.mimeType, file.type);
                    const href = file.type === 'folder' ? `#${file.name}/` : `#${file.name}`;
                    
                    html += `
                        <div class="file-row fade-in" style="animation-delay: ${index * 0.1}s">
                            <div class="file-name">
                                <div class="file-icon ${iconClass}">${icon}</div>
                                <a href="${href}" class="file-link">${file.name}${file.type === 'folder' ? '/' : ''}</a>
                            </div>
                            <div class="file-size">${file.size}</div>
                            <div class="file-date">${file.modified}</div>
                            <div class="file-type">${file.mimeType.split('/')[1] || 'folder'}</div>
                        </div>
                    `;
                });
                
                fileList.innerHTML = html;
            }, 1000);
        }

        function updateBreadcrumb(path) {
            const breadcrumb = document.getElementById('breadcrumb');
            const parts = path.split('/').filter(part => part);
            
            let html = '<div class="breadcrumb-item">Home</div>';
            parts.forEach(part => {
                html += `<div class="breadcrumb-item">${part}</div>`;
            });
            
            breadcrumb.innerHTML = html;
        }

        // Initialize the interface
        document.addEventListener('DOMContentLoaded', function() {
            renderFiles(mockFiles);
            
            // Add click handlers for navigation
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('file-link')) {
                    e.preventDefault();
                    const href = e.target.getAttribute('href');
                    if (href.endsWith('/')) {
                        // Navigate to folder
                        updateBreadcrumb(href.slice(1));
                        document.getElementById('heading').textContent = `Index of ${href}`;
                    }
                }
            });
        });
    </script>
</body>
</html>
