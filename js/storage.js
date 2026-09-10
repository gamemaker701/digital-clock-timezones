// LocalStorage Manager
const Storage = {
    KEYS: {
        TIMEZONES: 'activeTimezones',
        FAVORITES: 'favoriteTimezones',
        FORMAT: 'use24HourFormat',
        SHOW_SECONDS: 'showSeconds',
        SHOW_DATE: 'showDate',
        THEME: 'theme'
    },

    // Get active timezones
    getActiveTimezones() {
        const data = localStorage.getItem(this.KEYS.TIMEZONES);
        return data ? JSON.parse(data) : [];
    },

    // Set active timezones
    setActiveTimezones(timezones) {
        localStorage.setItem(this.KEYS.TIMEZONES, JSON.stringify(timezones));
    },

    // Add timezone
    addTimezone(timezone) {
        const timezones = this.getActiveTimezones();
        if (!timezones.includes(timezone)) {
            timezones.push(timezone);
            this.setActiveTimezones(timezones);
        }
    },

    // Remove timezone
    removeTimezone(timezone) {
        let timezones = this.getActiveTimezones();
        timezones = timezones.filter(tz => tz !== timezone);
        this.setActiveTimezones(timezones);
    },

    // Get favorites
    getFavorites() {
        const data = localStorage.getItem(this.KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    },

    // Toggle favorite
    toggleFavorite(timezone) {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(timezone);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(timezone);
        }
        localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
    },

    // Is favorite
    isFavorite(timezone) {
        return this.getFavorites().includes(timezone);
    },

    // Get settings
    getFormat() {
        return localStorage.getItem(this.KEYS.FORMAT) === 'true';
    },

    setFormat(use24Hour) {
        localStorage.setItem(this.KEYS.FORMAT, use24Hour);
    },

    getShowSeconds() {
        return localStorage.getItem(this.KEYS.SHOW_SECONDS) === 'true';
    },

    setShowSeconds(value) {
        localStorage.setItem(this.KEYS.SHOW_SECONDS, value);
    },

    getShowDate() {
        return localStorage.getItem(this.KEYS.SHOW_DATE) === 'true';
    },

    setShowDate(value) {
        localStorage.setItem(this.KEYS.SHOW_DATE, value);
    },

    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    // Clear all data
    clearAll() {
        localStorage.clear();
    }
};
