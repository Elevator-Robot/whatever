# 🐱 Cat Video Electronic Data Capture System

An intuitive web-based electronic data capture (EDC) system designed specifically for cataloging and managing data about your favorite cat videos.

## Features

### 📝 Data Capture
- **Comprehensive Video Information**: Capture title, URL, duration, rating, category, tags, notes, and watch date
- **Smart Categories**: Pre-defined categories including Funny, Cute, Compilation, Kitten, Tricks, Reaction, and Other
- **5-Star Rating System**: Rate videos from 1-5 stars with emoji indicators
- **Tag Support**: Add multiple tags separated by commas for better organization
- **Auto-Save**: Form data is automatically saved as you type to prevent data loss
- **Date Tracking**: Automatically sets today's date, with option to modify

### 📋 Data Management
- **View All Records**: Browse all captured cat video data in an organized card layout
- **Search Functionality**: Search through titles, notes, and tags
- **Category Filtering**: Filter records by category for quick access
- **Edit Records**: Modify existing entries with a single click
- **Delete Records**: Remove unwanted entries with confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 💾 Data Persistence & Export
- **Local Storage**: All data is stored locally in your browser
- **Export to JSON**: Download your complete dataset as a JSON file
- **Import Data**: Upload previously exported data files
- **Merge Capability**: Import data without duplicating existing records
- **Clear All Data**: Option to reset the entire dataset (with confirmation)

### 📊 Analytics
- **Statistics Dashboard**: View insights about your cat video collection
  - Total number of videos
  - Average rating across all videos
  - Total watch time
  - Most popular category
- **Real-time Updates**: Statistics update automatically as you add/modify records

## Getting Started

### Quick Start
1. Open `index.html` in any modern web browser
2. Click on "📝 Capture Data" tab
3. Fill in the video details (only title is required)
4. Click "💾 Save Video Data"
5. View your saved records in the "📋 View Records" tab

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No server or internet connection required

## Usage Guide

### Capturing Video Data
1. **Navigate to Capture Tab**: Click the "📝 Capture Data" tab
2. **Fill Required Information**: At minimum, enter a video title
3. **Add Optional Details**:
   - **URL**: Direct link to the video
   - **Duration**: Length in seconds
   - **Rating**: 1-5 star rating
   - **Category**: Select from predefined categories
   - **Tags**: Comma-separated keywords (e.g., "orange cat, sleeping, funny")
   - **Notes**: Additional observations or comments
   - **Date Watched**: When you watched the video (defaults to today)
4. **Save**: Click "💾 Save Video Data" to store the record

### Managing Records
1. **View Records**: Switch to "📋 View Records" tab
2. **Search**: Use the search box to find specific videos
3. **Filter**: Select a category from the dropdown to filter results
4. **Edit**: Click "✏️ Edit" on any record to modify it
5. **Delete**: Click "🗑️ Delete" to remove a record (with confirmation)

### Data Export/Import
1. **Export**: 
   - Go to "💾 Export/Import" tab
   - Click "📥 Download Data" to save your data as JSON
2. **Import**:
   - Click "Choose File" and select a previously exported JSON file
   - Data will be merged with existing records (no duplicates)
3. **Statistics**: View analytics about your cat video collection

## Data Structure

Each cat video record contains:
```json
{
  "id": "unique_identifier",
  "title": "Video Title",
  "url": "https://example.com/video",
  "duration": 120,
  "rating": "5",
  "category": "funny",
  "tags": ["orange cat", "sleeping"],
  "notes": "This cat is adorable!",
  "dateWatched": "2024-01-01",
  "created": "2024-01-01T12:00:00.000Z",
  "modified": "2024-01-01T12:00:00.000Z"
}
```

## Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Storage**: Browser localStorage for data persistence
- **Design**: Responsive design with CSS Grid and Flexbox
- **Compatibility**: Works in all modern browsers

### File Structure
```
cat-video-edc/
├── index.html          # Main application interface
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Documentation
```

### Browser Storage
- Data is stored using `localStorage` API
- Storage key: `catVideoData`
- Auto-save functionality uses: `catVideoFormAutoSave`
- Data persists between browser sessions
- No external dependencies or internet connection required

## Security & Privacy

- **Local-Only**: All data stays in your browser, never sent to external servers
- **No Tracking**: No analytics, cookies, or tracking mechanisms
- **Offline Capable**: Works completely offline once loaded
- **Data Control**: You have complete control over your data with export/import functionality

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future versions:
- Cloud synchronization options
- Advanced filtering and sorting
- Batch operations
- Video thumbnail capture
- Sharing capabilities
- Advanced analytics and visualizations

## Contributing

This is an open-source project. Feel free to contribute by:
- Reporting bugs or issues
- Suggesting new features
- Improving documentation
- Submitting code improvements

## License

This project is open source and available under standard open source licensing terms.

---

**Happy cat video cataloging! 🐾**
