<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Cloud Drive</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --background: #0f172a;
            --surface: #1e293b;
            --surface-light: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background);
            color: var(--text-primary);
            min-height: 100vh;
        }

        .card {
            background: var(--surface);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
        }

        .file-icon {
            color: var(--primary);
            background: rgba(99, 102, 241, 0.1);
            border-radius: 8px;
            padding: 10px;
        }

        .folder-icon {
            color: var(--warning);
            background: rgba(245, 158, 11, 0.1);
            border-radius: 8px;
            padding: 10px;
        }

        .nav-item {
            position: relative;
            transition: all 0.2s ease;
        }

        .nav-item::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: width 0.3s ease;
        }

        .nav-item:hover::after {
            width: 100%;
        }

        .active-nav::after {
            width: 100%;
        }

        .search-bar {
            background: var(--surface-light);
            transition: all 0.3s ease;
        }

        .search-bar:focus-within {
            outline: 2px solid var(--primary);
        }

        .progress-bar {
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark));
            border-radius: 2px;
            animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
        }

        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px) }
            to { opacity: 1; transform: translateY(0) }
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .grid-view {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.5rem;
        }

        @media (max-width: 768px) {
            .grid-view {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-indigo-900 to-indigo-800 shadow-lg">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="text-2xl font-bold flex items-center">
                        <i class="fas fa-cloud mr-2"></i>
                        <span>CloudDrive</span>
                    </div>
                    
                    <!-- Breadcrumbs -->
                    <div class="hidden md:flex items-center text-sm space-x-2">
                        <a href="/" class="hover:text-indigo-200 transition">Home</a>
                        <i class="fas fa-chevron-right text-xs opacity-50"></i>
                        <a href="/documents" class="hover:text-indigo-200 transition">Documents</a>
                        <i class="fas fa-chevron-right text-xs opacity-50"></i>
                        <span class="text-indigo-200">Project Files</span>
                    </div>
                </div>
                
                <!-- Search and User Area -->
                <div class="flex items-center space-x-4">
                    <div class="relative search-bar rounded-full px-4 py-2 w-64">
                        <i class="fas fa-search absolute left-4 top-3 text-indigo-200"></i>
                        <input type="text" placeholder="Search files..." class="bg-transparent border-none w-full pl-10 focus:outline-none text-sm">
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <button class="bg-indigo-700 hover:bg-indigo-600 transition rounded-full p-2">
                            <i class="fas fa-bell"></i>
                        </button>
                        
                        <div class="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
        <!-- Action Bar -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold mb-1">Project Files</h1>
                <p class="text-indigo-200 text-sm">12 items • Last updated 2 hours ago</p>
            </div>
            
            <div class="flex space-x-3">
                <div class="flex bg-slate-700 rounded-full overflow-hidden">
                    <button class="px-4 py-2 text-sm bg-indigo-600">
                        <i class="fas fa-th mr-2"></i> Grid
                    </button>
                    <button class="px-4 py-2 text-sm hover:bg-slate-600 transition">
                        <i class="fas fa-list mr-2"></i> List
                    </button>
                </div>
                
                <button class="btn-primary px-4 py-2 rounded-full text-sm flex items-center">
                    <i class="fas fa-plus mr-2"></i> Upload
                </button>
            </div>
        </div>
        
        <!-- File Browser -->
        <div class="grid-view">
            <!-- Folder Item -->
            <div class="card p-4 cursor-pointer">
                <div class="folder-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-folder text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">Design Assets</h3>
                <p class="text-sm text-slate-400">15 items</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: Today</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <!-- File Items -->
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-pdf text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">Project Proposal.pdf</h3>
                <p class="text-sm text-slate-400">2.4 MB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: Yesterday</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-code text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">index.html</h3>
                <p class="text-sm text-slate-400">28 KB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: 3 days ago</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-image text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">screenshot.png</h3>
                <p class="text-sm text-slate-400">1.8 MB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: 1 week ago</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-audio text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">presentation.mp3</h3>
                <p class="text-sm text-slate-400">18.5 MB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: 2 days ago</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-video text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">demo_video.mp4</h3>
                <p class="text-sm text-slate-400">245 MB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: 2 weeks ago</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-excel text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">budget.xlsx</h3>
                <p class="text-sm text-slate-400">1.1 MB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: 4 days ago</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="card p-4 cursor-pointer">
                <div class="file-icon w-12 h-12 flex items-center justify-center mb-3">
                    <i class="fas fa-file-alt text-xl"></i>
                </div>
                <h3 class="font-medium mb-1 truncate">meeting_notes.txt</h3>
                <p class="text-sm text-slate-400">4 KB</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-xs text-slate-400">Modified: Today</span>
                    <button class="text-slate-400 hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        </div>
    </main>

    <!-- File Preview Modal -->
    <div class="fixed inset-0 z-50 hidden" id="previewModal">
        <div class="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>
        <div class="relative max-w-4xl mx-auto my-32 bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div class="absolute top-4 right-4 z-10">
                <button class="text-slate-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="h-96 flex items-center justify-center bg-slate-900 relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i class="fas fa-file-alt text-6xl text-slate-600"></i>
                </div>
                <img src="" alt="" class="max-h-full max-w-full z-10" id="previewImage">
            </div>
            
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h2 class="text-xl font-bold mb-1" id="previewFileName">filename.ext</h2>
                        <div class="flex space-x-4 text-sm text-slate-400">
                            <span id="previewFileSize">0 KB</span>
                            <span id="previewModified">Modified: Today</span>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button class="btn-primary px-4 py-2 rounded-md text-sm flex items-center">
                            <i class="fas fa-download mr-2"></i> Download
                        </button>
                        <button class="border border-slate-600 px-4 py-2 rounded-md text-sm flex items-center hover:bg-slate-700 transition">
                            <i class="fas fa-share-alt mr-2"></i> Share
                        </button>
                    </div>
                </div>
                
                <div class="mt-6 pt-6 border-t border-slate-700">
                    <h4 class="text-sm font-medium mb-3 text-slate-400">FILE ACTIONS</h4>
                    <div class="grid grid-cols-3 gap-3">
                        <button class="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 transition">
                            <i class="fas fa-copy mb-1"></i>
                            <span class="text-xs">Copy Link</span>
                        </button>
                        <button class="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 transition">
                            <i class="fas fa-edit mb-1"></i>
                            <span class="text-xs">Rename</span>
                        </button>
                        <button class="flex flex-col items-center p-3 rounded-lg hover:bg-slate-700 transition">
                            <i class="fas fa-trash-alt mb-1"></i>
                            <span class="text-xs">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // File preview functionality
        document.querySelectorAll('.card:not(:first-child)').forEach(card => {
            card.addEventListener('click', function() {
                const fileName = this.querySelector('h3').textContent;
                const fileSize = this.querySelector('p').textContent;
                const modified = this.querySelector('span').textContent;
                const icon = this.querySelector('.file-icon i').className;
                
                document.getElementById('previewFileName').textContent = fileName;
                document.getElementById('previewFileSize').textContent = fileSize;
                document.getElementById('previewModified').textContent = modified;
                
                // Set appropriate preview based on file type
                if (icon.includes('image')) {
                    document.getElementById('previewImage').src = 'https://source.unsplash.com/random/800x600';
                    document.getElementById('previewImage').classList.remove('hidden');
                } else {
                    document.getElementById('previewImage').classList.add('hidden');
                }
                
                // Show modal
                document.getElementById('previewModal').classList.remove('hidden');
            });
        });
        
        // Close modal
        document.querySelector('#previewModal button').addEventListener('click', function() {
            document
