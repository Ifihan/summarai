document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const icon = themeButton.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.className = `${savedTheme}-theme`;
    updateThemeIcon();

    themeButton.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        updateThemeIcon();
        
        // Save theme preference
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    function updateThemeIcon() {
        const isDark = body.classList.contains('dark-theme');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Typewriter effect
    const tagline = document.getElementById('tagline');
    const text = "Your one-stop text analyzer powered by Vertex AI";
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            tagline.innerHTML = text.substring(0, index + 1) + '<span class="typewriter"></span>';
            index++;
            setTimeout(typeWriter, 50);
        } else {
            tagline.innerHTML = text;
            // Restart animation after 5 seconds
            setTimeout(() => {
                index = 0;
                typeWriter();
            }, 5000);
        }
    }

    typeWriter();

    // Main functionality
    const actionButtons = document.querySelectorAll('.action-button');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const textarea = document.getElementById('text-input');
    const copyButton = document.getElementById('copy-button');
    const fileUpload = document.getElementById('file-upload');
    const uploadButton = document.getElementById('upload-button');
    const uploadStatus = document.getElementById('upload-status');

    // File upload functionality
    uploadButton.addEventListener('click', () => {
        fileUpload.click();
    });

    fileUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show loading status
        showUploadStatus('Processing document...', 'loading');
        
        try {
            const text = await extractTextFromFile(file);
            textarea.value = text;
            showUploadStatus('Document processed successfully!', 'success');
            
            // Clear the status after 3 seconds
            setTimeout(() => {
                hideUploadStatus();
            }, 3000);
        } catch (error) {
            console.error('Error extracting text:', error);
            showUploadStatus('Failed to process document. ' + error.message, 'error');
        }
        
        // Reset the file input so the same file can be selected again
        fileUpload.value = '';
    });

    // Function to extract text from different file types
    async function extractTextFromFile(file) {
        const fileType = file.name.split('.').pop().toLowerCase();
        
        if (fileType === 'pdf') {
            return extractTextFromPDF(file);
        } else if (fileType === 'doc' || fileType === 'docx') {
            return extractTextFromWord(file);
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or Word document.');
        }
    }

    // Extract text from PDF using PDF.js
    async function extractTextFromPDF(file) {
        // Set the workerSrc property for PDF.js
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            
            fileReader.onload = async function() {
                try {
                    const typedArray = new Uint8Array(this.result);
                    const loadingTask = pdfjsLib.getDocument(typedArray);
                    
                    const pdf = await loadingTask.promise;
                    let fullText = '';
                    
                    // Extract text from each page
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const textItems = textContent.items.map(item => item.str);
                        fullText += textItems.join(' ') + '\n\n';
                    }
                    
                    resolve(fullText.trim());
                } catch (error) {
                    reject(new Error('Failed to extract text from PDF: ' + error.message));
                }
            };
            
            fileReader.onerror = function() {
                reject(new Error('Failed to read the file'));
            };
            
            fileReader.readAsArrayBuffer(file);
        });
    }

    // Extract text from Word document using mammoth.js
    async function extractTextFromWord(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const arrayBuffer = event.target.result;
                
                mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then(result => {
                        resolve(result.value);
                    })
                    .catch(error => {
                        reject(new Error('Failed to extract text from Word document: ' + error.message));
                    });
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read the file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    // Helper functions for upload status
    function showUploadStatus(message, type = '') {
        uploadStatus.textContent = message;
        uploadStatus.className = 'upload-status show';
        
        if (type) {
            uploadStatus.classList.add(type);
        }
    }

    function hideUploadStatus() {
        uploadStatus.className = 'upload-status';
    }

    // Smooth scroll to result
    function scrollToResult() {
        if (resultContainer.style.display === 'block') {
            resultContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    // Reset button state
    function resetButton(button, action) {
        let iconClass = 'fas fa-compress-alt'; // default for summarize
        
        if (action === 'extract-key-points') {
            iconClass = 'fas fa-list';
        } else if (action === 'analyze') {
            iconClass = 'fas fa-chart-bar';
        }

        button.innerHTML = `<i class="${iconClass}"></i> ${action.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}`;
    }

    // Show loading state
    function setLoadingState(button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    // Handle API calls
    async function processText(button, action) {
        const text = textarea.value.trim();
        
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Disable all buttons and show loading state
        actionButtons.forEach(btn => btn.disabled = true);
        setLoadingState(button);

        try {
            const response = await fetch(`/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (response.ok) {
                // Render the result as Markdown
                const markdownContent = data.summary || data.key_points || data.analysis || 
                    '<p class="error">No result available</p>';
                
                resultText.innerHTML = marked.parse(markdownContent);
                
                // Show container with animation
                resultContainer.style.display = 'block';
                resultContainer.classList.remove('slide-in');
                void resultContainer.offsetWidth; // Trigger reflow
                resultContainer.classList.add('slide-in');

                scrollToResult();

                // Show success state on button
                button.innerHTML = `<i class="fas fa-check"></i> ${action.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}`;
            } else {
                resultText.innerHTML = `<p class="error">${data.error || 'An error occurred while processing your request.'}</p>`;
                button.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error`;
            }
        } catch (error) {
            console.error('Error:', error);
            resultText.innerHTML = '<p class="error">Failed to connect to the server. Please try again.</p>';
            button.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error`;
        } finally {
            actionButtons.forEach(btn => {
                btn.disabled = false;
                if (btn !== button) {
                    resetButton(btn, btn.dataset.action);
                }
            });

            if (button.innerHTML.includes('Error')) {
                setTimeout(() => {
                    resetButton(button, action);
                }, 2000);
            }
        }
    }

    // Add click handlers for action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            processText(button, action);
        });
    });

    // Copy functionality with improved feedback
    copyButton.addEventListener('click', async () => {
        const text = resultText.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyButton.classList.add('success');
            
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyButton.classList.remove('success');
            }, 2000);
        } catch (err) {
            copyButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to copy';
            copyButton.classList.add('error');
            
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyButton.classList.remove('error');
            }, 2000);
        }
    });

    // Optional: Add keyboard shortcuts
    textarea.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to trigger summarize
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const summarizeButton = document.querySelector('[data-action="summarize"]');
            if (!summarizeButton.disabled) {
                summarizeButton.click();
            }
        }
    });
});