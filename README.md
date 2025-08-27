# Word by Word Quran PDF Generator

A beautiful web application that allows you to generate PDF files containing word-by-word analysis of Quranic verses, organized by chapter (surah). The PDFs feature a right-to-left table layout with Arabic text and detailed descriptions/notes.

## Features

- 📖 **Complete Quran Coverage**: Access all 114 surahs (chapters) of the Quran
- 🔍 **Word-by-Word Analysis**: Each word includes transliteration, translation, and grammar notes
- 📄 **Beautiful PDF Generation**: Right-to-left table layout optimized for Arabic text
- 🎯 **Flexible Range Selection**: Generate PDFs for specific verse ranges or entire surahs
- ⚙️ **Customizable Options**: Choose what to include (transliteration, translation, grammar)
- 🌐 **Modern Web Interface**: Responsive design with Arabic font support
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices

## Screenshots

The application provides a clean, modern interface for selecting surahs and generating PDFs with customizable options.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd word-by-word-quran
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Usage

### Generating a PDF

1. **Select a Surah**: Choose from the dropdown menu containing all 114 surahs
2. **Set Verse Range** (optional): Specify start and end verses, or leave empty for the entire surah
3. **Choose Options**: Select what to include in the PDF:
   - Transliteration (Arabic pronunciation guide)
   - Translation (English meaning of each word)
   - Grammar Notes (grammatical analysis)
4. **Generate PDF**: Click the "Generate PDF" button to create and download your PDF

### PDF Format

The generated PDFs feature:
- **Right-to-Left Table Layout**: Optimized for Arabic text reading direction
- **Two-Column Design**:
  - **Column 1 (Right)**: Arabic text in beautiful Arabic fonts
  - **Column 2 (Left)**: Detailed descriptions and notes
- **Professional Styling**: Clean, readable format suitable for study and reference
- **Verse Organization**: Each verse is clearly separated with verse numbers
- **Page Headers/Footers**: Surah name, verse range, and page numbers

## API Endpoints

The application includes a REST API for accessing Quran data:

### Get All Surahs
```
GET /api/surahs
```
Returns a list of all 114 surahs with their names and metadata.

### Get Surah Data
```
GET /api/surah/:number
```
Returns detailed data for a specific surah including Arabic text, translations, and word-by-word information.

### Get Verse Data
```
GET /api/verse/:surah/:verse
```
Returns detailed word-by-word breakdown for a specific verse.

## Technology Stack

### Frontend
- **HTML5/CSS3**: Modern web standards with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features and async/await
- **jsPDF**: PDF generation library with Arabic text support
- **jsPDF-AutoTable**: Table generation for structured layout
- **Google Fonts**: Arabic fonts (Amiri, Noto Sans Arabic) and modern Latin fonts

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Axios**: HTTP client for API requests
- **CORS**: Cross-origin resource sharing support

### External APIs
- **Al Quran Cloud API**: Source for authentic Quranic text and translations

## Project Structure

```
word-by-word-quran/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles with Arabic font support
│   └── script.js          # JavaScript for PDF generation
├── server.js              # Express server and API routes
├── package.json           # Node.js dependencies and scripts
├── test-pdf.html         # Test file for PDF generation
└── README.md             # Project documentation
```

## Development

### Running in Development Mode

For development with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

### Testing PDF Generation

Open `test-pdf.html` in your browser to test the PDF generation functionality with sample data.

### Customization

#### Adding New Languages
To add support for additional languages:
1. Modify the API endpoints in `server.js` to fetch translations in other languages
2. Update the frontend to include language selection options
3. Add appropriate fonts for the target language

#### Styling Modifications
- Edit `public/styles.css` to customize the appearance
- Modify the PDF styling in `public/script.js` in the `generatePDF()` method

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Al Quran Cloud API** for providing authentic Quranic text and translations
- **Islamic Community** for guidance on proper Arabic text handling and formatting
- **Open Source Libraries** that make this project possible (jsPDF, Express, etc.)

## Support

For support, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This application is designed for educational and religious study purposes. The word-by-word analysis includes mock data for demonstration. For comprehensive linguistic analysis, consider integrating with specialized Quranic linguistics APIs.
