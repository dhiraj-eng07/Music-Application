class UploadManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadBtn = document.getElementById('upload-btn');
        uploadBtn.addEventListener('click', () => this.showUploadForm());

        // File upload handling
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';

        uploadArea.appendChild(fileInput);
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    showUploadForm() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = this.getUploadFormHTML();
        this.initializeUploadForm();
    }

    getUploadFormHTML() {
        return `
            <h1 class="page-title">Upload New Track</h1>
            <div class="upload-form">
                <div class="upload-area">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop your MP3 file here, or click to browse</p>
                    <input type="file" id="track-file" accept="audio/*" style="display: none;">
                </div>
                
                <div class="form-group">
                    <label for="track-name">Track Name</label>
                    <input type="text" id="track-name" required>
                </div>
                
                <div class="form-group">
                    <label for="artist-name">Artist Name</label>
                    <input type="text" id="artist-name" value="${auth.user.name}" readonly>
                </div>
                
                <div class="form-group">
                    <label for="release-date">Release Date</label>
                    <input type="date" id="release-date" required>
                </div>
                
                <div class="form-group">
                    <label for="genre">Genre</label>
                    <select id="genre" required>
                        <option value="">Select genre</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                        <option value="hiphop">Hip Hop</option>
                        <option value="electronic">Electronic</option>
                        <option value="jazz">Jazz</option>
                        <option value="classical">Classical</option>
                        <option value="rnb">R&B</option>
                        <option value="country">Country</option>
                    </select>
                </div>
                
                <button class="btn" id="submit-upload">Upload Track</button>
                <div id="upload-message" class="message hidden"></div>
            </div>
        `;
    }

    initializeUploadForm() {
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.getElementById('track-file');
        const submitBtn = document.getElementById('submit-upload');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        submitBtn.addEventListener('click', () => this.submitUpload());
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--primary)"></i>
                <p>${file.name}</p>
                <small>Click to change file</small>
            `;
        }
    }

    async submitUpload() {
        const fileInput = document.getElementById('track-file');
        const trackName = document.getElementById('track-name').value;
        const releaseDate = document.getElementById('release-date').value;
        const genre = document.getElementById('genre').value;

        if (!fileInput.files[0] || !trackName || !releaseDate || !genre) {
            this.showMessage('Please fill all fields', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('track', fileInput.files[0]);
        formData.append('name', trackName);
        formData.append('releaseDate', releaseDate);
        formData.append('genre', genre);

        try {
            const response = await fetch(`${API_BASE}/tracks/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Track uploaded successfully!', 'success');
                // Clear form
                document.getElementById('track-name').value = '';
                document.getElementById('release-date').value = '';
                document.getElementById('genre').value = '';
                fileInput.value = '';
                
                // Reset upload area
                const uploadArea = document.querySelector('.upload-area');
                uploadArea.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop your MP3 file here, or click to browse</p>
                `;
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('upload-message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }
}

const uploadManager = new UploadManager();
