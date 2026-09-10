// Timezone Manager
const TimezoneManager = {
    // Common timezones
    commonTimezones: [
        'America/New_York',
        'America/Chicago',
        'America/Los_Angeles',
        'America/Denver',
        'America/Anchorage',
        'Pacific/Honolulu',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Moscow',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Bangkok',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Hong_Kong',
        'Asia/Singapore',
        'Australia/Sydney',
        'Australia/Melbourne',
        'Pacific/Auckland',
        'UTC'
    ],

    // Get all available timezones
    getAllTimezones() {
        return Intl.supportedValuesOf('timeZone');
    },

    // Format timezone name for display
    formatTimezoneName(timezone) {
        return timezone.replace(/_/g, ' ').replace(/\//g, ' - ');
    },

    // Get timezone offset
    getTimezoneOffset(timezone) {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        const offset = (date - localDate) / (1000 * 60); // in minutes
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';

        return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    },

    // Get current time in timezone
    getTimeInTimezone(timezone, use24Hour = true, showSeconds = false) {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !use24Hour
        });

        const parts = formatter.formatToParts(date);
        let time = '';

        for (const part of parts) {
            if (part.type === 'hour' || part.type === 'minute') {
                time += part.value;
                if (part.type === 'minute' && showSeconds) {
                    time += ':';
                } else if (part.type === 'minute') {
                    break;
                }
            } else if (part.type === 'second' && showSeconds) {
                time += part.value;
            } else if (part.type === 'literal' && (showSeconds || part.value === ':')) {
                time += part.value;
            }
        }

        // Add AM/PM if 12-hour format
        if (!use24Hour) {
            const hour = parseInt(parts.find(p => p.type === 'hour').value);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            time += ' ' + ampm;
        }

        return time;
    },

    // Get date in timezone
    getDateInTimezone(timezone) {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return formatter.format(date);
    },

    // Get timezone city from name
    getTimezoneCity(timezone) {
        const parts = timezone.split('/');
        return parts[parts.length - 1].replace(/_/g, ' ');
    },

    // Search timezones
    searchTimezones(query) {
        const allTimezones = this.getAllTimezones();
        const searchLower = query.toLowerCase();

        return allTimezones.filter(tz => {
            const displayName = this.formatTimezoneName(tz).toLowerCase();
            const city = this.getTimezoneCity(tz).toLowerCase();
            return displayName.includes(searchLower) || city.includes(searchLower);
        });
    }
};
