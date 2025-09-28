class MusicApp {
    constructor() {
        this.currentPage = 'home';
        this.tracks = [];
        this.playlists = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });

        // User menu
        document.getElementById('user-menu').addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelector('.dropdown-menu').classList.toggle('hidden');
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.logout();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            document.querySelector('.dropdown-menu').classList.add('hidden');
        });

        // Back/forward buttons
        document.getElementById('back-btn').addEventListener('click', () => window.history.back());
        document.getElementById('forward-btn').addEventListener('click', () => window.history.forward());
    }

    async initializeApp() {
        await this.loadTracks();
        await this.loadPlaylists();
        this.navigateTo('home');
        
        // Show upload button only for artists
        if (!auth.isArtist()) {
            document.getElementById('upload-btn').style.display = 'none';
        }
    }

    async loadTracks() {
        try {
            const response = await fetch(`${API_BASE}/tracks`);
            this.tracks = await response.json();
        } catch (error) {
            console.error('Error loading tracks:', error);
        }
    }

    async loadPlaylists() {
        try {
            // In a real app, this would fetch user's playlists
            // For now, we'll create some mock data
            this.playlists = [
                { _id: '1', name: 'Liked Songs', type: 'liked', tracks: this.tracks.slice(0, 5  ) },
                { _id: '2', name: 'My Playlist 1', type: 'custom', tracks: this.tracks.slice(5, 10) },
            ];
        }   catch (error) {             
            console.error('Error loading playlists:', error);
        }
    }               



    navigateTo(page) {
        this.currentPage = page;
        window.history.pushState({ page }, '', `#${page}`);
        this.renderPage();
    }
}

const app = new MusicApp();
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        app.currentPage = event.state.page;
        app.renderPage();
    }
});

app.initializeApp();
app.renderPage = function() {
    const appContainer = document.getElementById('app');    
    appContainer.innerHTML = '';
    switch (this.currentPage) {
        case 'home':
            this.renderHomePage(appContainer);  
            break;
        case 'search':
            this.renderSearchPage(appContainer);
            break;  
        case 'upload':
            this.renderUploadPage(appContainer);        
            break;
        case 'library':
            this.renderLibraryPage(appContainer);
            break
        case 'profile':
            this.renderProfilePage(appContainer);
            break;      
        default:
            appContainer.innerHTML = '<h2>Page Not Found</h2>';

    }
    this.updateActiveNav();
}   
