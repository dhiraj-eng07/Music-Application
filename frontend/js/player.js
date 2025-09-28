class MusicPlayer {
    // ... existing code ...

    async playTrack(track) {
        this.currentTrack = track;
        
        // Dynamic file URL for production
        const baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : '';
        
        this.audio.src = `${baseUrl}/${track.fileUrl}`;
        
        // Update UI
        document.getElementById('now-playing-name').textContent = track.name;
        document.getElementById('now-playing-artist').textContent = track.artist.name;
        
        const coverUrl = track.coverArt 
            ? `${baseUrl}/${track.coverArt}`
            : '';
            
        document.getElementById('now-playing-img').innerHTML = track.coverArt 
            ? `<img src="${coverUrl}" alt="${track.name}">`
            : '<i class="fas fa-music"></i>';

        // ... rest of the method
    }
}
