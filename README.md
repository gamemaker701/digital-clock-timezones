# Digital Clock - Multi-Timezone Display

A modern digital clock application that displays the current time across multiple time zones with real-time updates and an intuitive UI.

## Features

✨ **Multi-Timezone Support**
- Display time in multiple time zones simultaneously
- Support for 24-hour and 12-hour formats
- Easy timezone selection and customization

🕐 **Real-Time Updates**
- Live clock updates every second
- Accurate time synchronization
- Smooth time transitions

🎨 **Modern UI**
- Clean and responsive design
- Dark/Light theme support
- Responsive grid layout

🌍 **Timezone Management**
- Add/remove timezones dynamically
- Search timezone database
- Save favorite timezones
- Display timezone offset and city info

## Project Structure

```
digital-clock-timezones/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css     # Main stylesheet
│   └── theme.css      # Theme variables
├── js/
│   ├── clock.js       # Clock logic
│   ├── timezone.js    # Timezone management
│   ├── ui.js          # UI controllers
│   └── storage.js     # Local storage handler
├── data/
│   └── timezones.json # Timezone database
└── README.md
```

## Getting Started

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/gamemaker701/digital-clock-timezones.git
cd digital-clock-timezones
```

2. Open in browser
```bash
# Using Python
python -m http.server 8000

# Or open directly
open index.html
```

3. Access the application
```
http://localhost:8000
```

## Usage

### Adding Timezones
1. Click the "+ Add Timezone" button
2. Search or select from the timezone list
3. The clock will automatically display

### Switching Formats
- Toggle between 12-hour (AM/PM) and 24-hour formats
- Click the format button in the header

### Managing Favorites
- Click the star icon to save/remove favorite timezones
- Access favorites from the sidebar

### Theme Selection
- Toggle Dark/Light mode from settings
- Settings are automatically saved

## Supported Timezones

The application supports all IANA timezone identifiers including:
- North America (EST, CST, MST, PST)
- Europe (GMT, CET, EET)
- Asia (IST, JST, CST, AEST)
- And 400+ more...

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Intl API (for timezone handling)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
