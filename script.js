// Cat Video Data Capture System
class CatVideoEDC {
    constructor() {
        this.storageKey = 'catVideoData';
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.displayRecords();
        this.updateStats();
        
        // Set default date to today
        document.getElementById('dateWatched').value = new Date().toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('catVideoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });

        // Auto-save to localStorage on input changes
        const inputs = document.querySelectorAll('#catVideoForm input, #catVideoForm select, #catVideoForm textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.autoSave());
        });

        // Load auto-saved data on page load
        this.loadAutoSave();
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
        this.data = data ? JSON.parse(data) : [];
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    autoSave() {
        const formData = this.getFormData();
        localStorage.setItem('catVideoFormAutoSave', JSON.stringify(formData));
    }

    loadAutoSave() {
        const autoSaveData = localStorage.getItem('catVideoFormAutoSave');
        if (autoSaveData) {
            const data = JSON.parse(autoSaveData);
            this.populateForm(data);
        }
    }

    clearAutoSave() {
        localStorage.removeItem('catVideoFormAutoSave');
    }

    getFormData() {
        const form = document.getElementById('catVideoForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Process tags
        if (data.tags) {
            data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        return data;
    }

    populateForm(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'tags' && Array.isArray(data[key])) {
                    element.value = data[key].join(', ');
                } else {
                    element.value = data[key];
                }
            }
        });
    }

    saveRecord() {
        const data = this.getFormData();
        
        // Validation
        if (!data.title || data.title.trim() === '') {
            this.showNotification('Please enter a video title', 'error');
            return;
        }

        // Add metadata
        data.id = this.currentEditId || Date.now().toString();
        data.created = this.currentEditId ? 
            this.data.find(item => item.id === this.currentEditId)?.created : 
            new Date().toISOString();
        data.modified = new Date().toISOString();

        if (this.currentEditId) {
            // Update existing record
            const index = this.data.findIndex(item => item.id === this.currentEditId);
            this.data[index] = data;
            this.showNotification('Video data updated successfully!', 'success');
            this.currentEditId = null;
        } else {
            // Add new record
            this.data.unshift(data); // Add to beginning
            this.showNotification('Video data saved successfully!', 'success');
        }

        this.saveData();
        this.clearForm();
        this.clearAutoSave();
        this.displayRecords();
        this.updateStats();
    }

    clearForm() {
        document.getElementById('catVideoForm').reset();
        document.getElementById('dateWatched').value = new Date().toISOString().split('T')[0];
        this.currentEditId = null;
    }

    displayRecords() {
        const container = document.getElementById('recordsList');
        
        if (this.filteredData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No cat videos recorded yet! 🐱</h3>
                    <p>Start capturing data about your favorite cat videos using the "Capture Data" tab.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredData.map(record => this.createRecordCard(record)).join('');
    }

    get filteredData() {
        let filtered = [...this.data];
        
        // Search filter
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(record => 
                record.title.toLowerCase().includes(searchTerm) ||
                record.notes?.toLowerCase().includes(searchTerm) ||
                record.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        if (categoryFilter) {
            filtered = filtered.filter(record => record.category === categoryFilter);
        }
        
        return filtered;
    }

    createRecordCard(record) {
        const formatDate = (dateString) => {
            if (!dateString) return 'Not specified';
            return new Date(dateString).toLocaleDateString();
        };

        const formatDuration = (seconds) => {
            if (!seconds) return 'Unknown';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        };

        const getRatingStars = (rating) => {
            if (!rating) return 'Not rated';
            return '⭐'.repeat(parseInt(rating));
        };

        const getCategoryEmoji = (category) => {
            const emojis = {
                funny: '😹',
                cute: '😻',
                compilation: '📹',
                kitten: '🐱',
                trick: '🎪',
                reaction: '😮',
                other: '🔖'
            };
            return emojis[category] || '🎬';
        };

        return `
            <div class="record-card">
                <div class="record-header">
                    <div>
                        <div class="record-title">${this.escapeHtml(record.title)}</div>
                        <div class="record-meta">
                            <span>📅 ${formatDate(record.dateWatched)}</span>
                            <span>⏱️ ${formatDuration(record.duration)}</span>
                            <span class="rating">${getRatingStars(record.rating)}</span>
                            ${record.category ? `<span>${getCategoryEmoji(record.category)} ${record.category}</span>` : ''}
                        </div>
                    </div>
                    <div class="record-actions">
                        <button class="edit-btn" onclick="app.editRecord('${record.id}')">✏️ Edit</button>
                        <button class="delete-btn" onclick="app.deleteRecord('${record.id}')">🗑️ Delete</button>
                    </div>
                </div>
                
                ${record.url ? `<p><strong>URL:</strong> <a href="${record.url}" target="_blank" class="record-url">${record.url}</a></p>` : ''}
                
                ${record.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(record.notes)}</p>` : ''}
                
                ${record.tags && record.tags.length > 0 ? `
                    <div class="record-tags">
                        <strong>Tags:</strong>
                        ${record.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div style="margin-top: 10px; font-size: 0.8em; color: #666;">
                    Created: ${formatDate(record.created)} | Modified: ${formatDate(record.modified)}
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    editRecord(id) {
        const record = this.data.find(item => item.id === id);
        if (record) {
            this.populateForm(record);
            this.currentEditId = id;
            showTab('capture');
            this.showNotification('Record loaded for editing', 'success');
        }
    }

    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this cat video record?')) {
            this.data = this.data.filter(item => item.id !== id);
            this.saveData();
            this.displayRecords();
            this.updateStats();
            this.showNotification('Record deleted successfully', 'success');
        }
    }

    exportData() {
        if (this.data.length === 0) {
            this.showNotification('No data to export', 'error');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            records: this.data
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cat-videos-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate imported data structure
                if (!importedData.records || !Array.isArray(importedData.records)) {
                    throw new Error('Invalid file format');
                }

                // Merge with existing data
                const newRecords = importedData.records.filter(importedRecord => 
                    !this.data.some(existingRecord => existingRecord.id === importedRecord.id)
                );

                this.data = [...this.data, ...newRecords];
                this.saveData();
                this.displayRecords();
                this.updateStats();
                
                this.showImportStatus(`Successfully imported ${newRecords.length} new records!`, 'success');
            } catch (error) {
                this.showImportStatus('Error importing file: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }

    showImportStatus(message, type) {
        const statusDiv = document.getElementById('importStatus');
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete ALL cat video records? This cannot be undone!')) {
            this.data = [];
            this.saveData();
            this.displayRecords();
            this.updateStats();
            this.showNotification('All data cleared', 'success');
        }
    }

    updateStats() {
        const statsContainer = document.getElementById('statsDisplay');
        
        if (this.data.length === 0) {
            statsContainer.innerHTML = '<p>No data available for statistics.</p>';
            return;
        }

        const totalVideos = this.data.length;
        const avgRating = this.data
            .filter(record => record.rating)
            .reduce((sum, record) => sum + parseInt(record.rating), 0) / 
            this.data.filter(record => record.rating).length || 0;
        
        const totalDuration = this.data
            .filter(record => record.duration)
            .reduce((sum, record) => sum + parseInt(record.duration), 0);
            
        const categories = {};
        this.data.forEach(record => {
            if (record.category) {
                categories[record.category] = (categories[record.category] || 0) + 1;
            }
        });
        
        const mostPopularCategory = Object.keys(categories).length > 0 ?
            Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b) : 'None';

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${totalVideos}</div>
                    <div class="stat-label">Total Videos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${avgRating.toFixed(1)}</div>
                    <div class="stat-label">Average Rating</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.floor(totalDuration / 60)}m</div>
                    <div class="stat-label">Total Watch Time</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${mostPopularCategory}</div>
                    <div class="stat-label">Most Popular Category</div>
                </div>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
    
    // Refresh records display when viewing records tab
    if (tabName === 'view') {
        app.displayRecords();
    }
    
    // Update stats when viewing export tab
    if (tabName === 'export') {
        app.updateStats();
    }
}

// Filter records
function filterRecords() {
    app.displayRecords();
}

// Clear form
function clearForm() {
    app.clearForm();
}

// Export data
function exportData() {
    app.exportData();
}

// Import data
function importData(event) {
    app.importData(event);
}

// Clear all data
function clearAllData() {
    app.clearAllData();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
const app = new CatVideoEDC();