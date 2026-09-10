// UI Manager
const UI = {
    // Initialize UI
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadSettings();
        this.renderClocks();
        this.renderTimezoneList();
        ClockManager.init();
    },

    // Setup event listeners
    setupEventListeners() {
        // Format toggle
        document.getElementById('formatToggle').addEventListener('click', () => {
            const current = Storage.getFormat();
            Storage.setFormat(!current);
            this.updateFormatButton();
            ClockManager.update();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettingsModal();
        });

        // Add timezone button
        document.getElementById('addTimezoneBtn').addEventListener('click', () => {
            this.openTimezoneModal();
        });

        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeTimezoneModal();
        });

        document.getElementById('closeSettingsModal').addEventListener('click', () => {
            this.closeSettingsModal();
        });

        // Close modal on background click
        document.getElementById('timezoneModal').addEventListener('click', (e) => {
            if (e.target.id === 'timezoneModal') this.closeTimezoneModal();
        });

        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettingsModal();
        });

        // Timezone search
        document.getElementById('timezoneSearch').addEventListener('input', (e) => {
            this.filterTimezones(e.target.value);
        });

        // Sidebar search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterSidebarTimezones(e.target.value);
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTimezoneList(e.target.dataset.tab);
            });
        });

        // Settings checkboxes
        document.getElementById('use24Hour').addEventListener('change', (e) => {
            Storage.setFormat(e.target.checked);
            this.updateFormatButton();
            ClockManager.update();
        });

        document.getElementById('showSeconds').addEventListener('change', (e) => {
            Storage.setShowSeconds(e.target.checked);
            ClockManager.update();
        });

        document.getElementById('showDate').addEventListener('change', (e) => {
            Storage.setShowDate(e.target.checked);
            this.renderClocks();
            ClockManager.update();
        });

        // Clear data button
        document.getElementById('clearDataBtn').addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all your saved data.')) {
                Storage.clearAll();
                location.reload();
            }
        });
    },

    // Render clock cards
    renderClocks() {
        const timezones = Storage.getActiveTimezones();
        const clockGrid = document.getElementById('clockGrid');
        const emptyState = document.getElementById('emptyState');

        if (timezones.length === 0) {
            clockGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        clockGrid.innerHTML = timezones.map(tz => ClockManager.createClockCardHTML(tz)).join('');

        // Attach event listeners to clock cards
        clockGrid.querySelectorAll('.clock-card').forEach(card => {
            const timezone = card.dataset.timezone;

            card.querySelector('.favorite-btn').addEventListener('click', () => {
                Storage.toggleFavorite(timezone);
                this.renderClocks();
                this.renderTimezoneList();
            });

            card.querySelector('.remove-btn').addEventListener('click', () => {
                Storage.removeTimezone(timezone);
                this.renderClocks();
                this.renderTimezoneList();
            });
        });
    },

    // Render timezone list in sidebar
    renderTimezoneList(tab = 'active') {
        const sidebar = document.getElementById('timezoneSidebar');
        let timezones = Storage.getActiveTimezones();

        if (tab === 'favorites') {
            const favorites = Storage.getFavorites();
            timezones = timezones.filter(tz => favorites.includes(tz));
        }

        if (timezones.length === 0) {
            sidebar.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No timezones</p>';
            return;
        }

        sidebar.innerHTML = timezones.map(tz => {
            const city = TimezoneManager.getTimezoneCity(tz);
            const time = TimezoneManager.getTimeInTimezone(tz, Storage.getFormat());
            const isFavorite = Storage.isFavorite(tz);

            return `
                <div class="timezone-item" data-timezone="${tz}">
                    <div class="timezone-item-content">
                        <div class="timezone-item-name">${city}</div>
                        <div class="timezone-item-time">${time}</div>
                    </div>
                    <button class="timezone-btn favorite-btn" title="Toggle favorite">
                        ${isFavorite ? '⭐' : '☆'}
                    </button>
                </div>
            `;
        }).join('');

        // Attach event listeners
        sidebar.querySelectorAll('.timezone-item').forEach(item => {
            const timezone = item.dataset.timezone;

            item.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                Storage.toggleFavorite(timezone);
                this.renderTimezoneList(tab);
                this.renderClocks();
            });
        });
    },

    // Open timezone modal
    openTimezoneModal() {
        const modal = document.getElementById('timezoneModal');
        const list = document.getElementById('timezoneList');

        const commonTZ = TimezoneManager.commonTimezones;
        list.innerHTML = commonTZ.map(tz => `
            <div class="timezone-option" data-timezone="${tz}">
                <div>
                    <div class="timezone-option-name">${TimezoneManager.formatTimezoneName(tz)}</div>
                    <div class="timezone-option-offset">${TimezoneManager.getTimezoneOffset(tz)}</div>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.timezone-option').forEach(option => {
            option.addEventListener('click', () => {
                const timezone = option.dataset.timezone;
                Storage.addTimezone(timezone);
                this.renderClocks();
                this.renderTimezoneList();
                this.closeTimezoneModal();
            });
        });

        modal.classList.add('active');
    },

    // Close timezone modal
    closeTimezoneModal() {
        document.getElementById('timezoneModal').classList.remove('active');
    },

    // Filter timezones in modal
    filterTimezones(query) {
        const list = document.getElementById('timezoneList');
        const options = list.querySelectorAll('.timezone-option');

        if (!query) {
            this.openTimezoneModal();
            return;
        }

        const filtered = TimezoneManager.searchTimezones(query);
        list.innerHTML = filtered.map(tz => `
            <div class="timezone-option" data-timezone="${tz}">
                <div>
                    <div class="timezone-option-name">${TimezoneManager.formatTimezoneName(tz)}</div>
                    <div class="timezone-option-offset">${TimezoneManager.getTimezoneOffset(tz)}</div>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.timezone-option').forEach(option => {
            option.addEventListener('click', () => {
                const timezone = option.dataset.timezone;
                Storage.addTimezone(timezone);
                this.renderClocks();
                this.renderTimezoneList();
                this.closeTimezoneModal();
            });
        });
    },

    // Filter sidebar timezones
    filterSidebarTimezones(query) {
        // Could implement if needed
    },

    // Open settings modal
    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        document.getElementById('use24Hour').checked = Storage.getFormat();
        document.getElementById('showSeconds').checked = Storage.getShowSeconds();
        document.getElementById('showDate').checked = Storage.getShowDate();
        modal.classList.add('active');
    },

    // Close settings modal
    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    },

    // Toggle theme
    toggleTheme() {
        const currentTheme = Storage.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        Storage.setTheme(newTheme);
        this.loadTheme();
    },

    // Load theme
    loadTheme() {
        const theme = Storage.getTheme();
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    // Load settings
    loadSettings() {
        this.updateFormatButton();
    },

    // Update format button
    updateFormatButton() {
        const btn = document.getElementById('formatToggle');
        btn.textContent = Storage.getFormat() ? '24H' : '12H';
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
} else {
    UI.init();
}
