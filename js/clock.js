// Clock Manager
const ClockManager = {
    updateInterval: null,

    // Initialize clocks
    init() {
        this.update();
        this.startUpdating();
    },

    // Start updating clocks
    startUpdating() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => this.update(), 1000);
    },

    // Stop updating clocks
    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    },

    // Update all clocks
    update() {
        const timezones = Storage.getActiveTimezones();
        const use24Hour = Storage.getFormat();
        const showSeconds = Storage.getShowSeconds();
        const showDate = Storage.getShowDate();

        timezones.forEach(timezone => {
            this.updateClockCard(timezone, use24Hour, showSeconds, showDate);
        });
    },

    // Update single clock card
    updateClockCard(timezone, use24Hour, showSeconds, showDate) {
        const cardElement = document.querySelector(`[data-timezone="${timezone}"]`);
        if (!cardElement) return;

        const timeElement = cardElement.querySelector('.clock-time');
        const dateElement = cardElement.querySelector('.clock-date');
        const secondsElement = cardElement.querySelector('.clock-seconds');

        // Update time
        const time = TimezoneManager.getTimeInTimezone(timezone, use24Hour, showSeconds);
        if (timeElement) timeElement.textContent = time;

        // Update date
        if (showDate && dateElement) {
            const date = TimezoneManager.getDateInTimezone(timezone);
            dateElement.textContent = date;
            dateElement.style.display = 'block';
        } else if (dateElement) {
            dateElement.style.display = 'none';
        }

        // Update seconds (for display purposes)
        if (showSeconds && secondsElement) {
            secondsElement.style.display = 'none'; // Seconds already in time
        }
    },

    // Create clock card HTML
    createClockCardHTML(timezone) {
        const city = TimezoneManager.getTimezoneCity(timezone);
        const offset = TimezoneManager.getTimezoneOffset(timezone);
        const isFavorite = Storage.isFavorite(timezone);
        const use24Hour = Storage.getFormat();
        const showSeconds = Storage.getShowSeconds();
        const showDate = Storage.getShowDate();

        const time = TimezoneManager.getTimeInTimezone(timezone, use24Hour, showSeconds);
        const date = showDate ? TimezoneManager.getDateInTimezone(timezone) : '';

        return `
            <div class="clock-card" data-timezone="${timezone}">
                <div class="clock-card-header">
                    <div class="clock-location">
                        <div class="clock-city">${city}</div>
                        <div class="clock-offset">${offset}</div>
                    </div>
                    <div class="clock-card-actions">
                        <button class="clock-card-btn favorite-btn" title="Add to favorites">
                            ${isFavorite ? '⭐' : '☆'}
                        </button>
                        <button class="clock-card-btn remove-btn" title="Remove timezone">
                            ✕
                        </button>
                    </div>
                </div>
                <div class="clock-display">
                    <div class="clock-time">${time}</div>
                    ${showDate ? `<div class="clock-date">${date}</div>` : ''}
                    <div class="clock-seconds"></div>
                </div>
            </div>
        `;
    }
};
