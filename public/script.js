class QuranPDFGenerator {
    constructor() {
        this.surahs = [];
        this.currentSurahData = null;
        this.init();
    }

    init() {
        this.loadSurahs();
        this.setupEventListeners();
    }

    async loadSurahs() {
        try {
            const response = await fetch('/api/surahs');
            const data = await response.json();
            this.surahs = data.data;
            this.populateSurahSelect();
        } catch (error) {
            console.error('Error loading surahs:', error);
            this.showError('Failed to load surahs. Please refresh the page.');
        }
    }

    populateSurahSelect() {
        const select = document.getElementById('surahSelect');
        select.innerHTML = '<option value="">Select a Surah</option>';
        
        this.surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        const surahSelect = document.getElementById('surahSelect');
        const generateBtn = document.getElementById('generatePdf');
        
        surahSelect.addEventListener('change', (e) => {
            const generateBtn = document.getElementById('generatePdf');
            generateBtn.disabled = !e.target.value;
            
            if (e.target.value) {
                this.loadSurahPreview(e.target.value);
            } else {
                this.hidePreview();
            }
        });
        
        generateBtn.addEventListener('click', () => {
            this.generatePDF();
        });
    }

    async loadSurahPreview(surahNumber) {
        try {
            this.showLoading();
            const response = await fetch(`/api/surah/${surahNumber}`);
            const data = await response.json();
            this.currentSurahData = data;
            this.showPreview(data);
        } catch (error) {
            console.error('Error loading surah data:', error);
            this.showError('Failed to load surah data.');
        } finally {
            this.hideLoading();
        }
    }

    showPreview(data) {
        const previewSection = document.getElementById('previewSection');
        const previewContent = document.getElementById('previewContent');
        
        const verseStart = parseInt(document.getElementById('verseStart').value) || 1;
        const verseEnd = parseInt(document.getElementById('verseEnd').value) || data.surah.ayahs.length;
        
        const filteredVerses = data.surah.ayahs.slice(verseStart - 1, verseEnd);
        
        let previewHTML = `
            <div class="surah-info">
                <h4>${data.surah.englishName} (${data.surah.name})</h4>
                <p>Verses ${verseStart} to ${verseEnd} of ${data.surah.numberOfAyahs}</p>
            </div>
        `;
        
        filteredVerses.forEach((ayah, index) => {
            const verseNumber = verseStart + index;
            const words = this.parseArabicWords(ayah.text);
            const translation = data.translation.ayahs[verseStart - 1 + index]?.text || '';
            
            previewHTML += `
                <div class="verse-preview">
                    <div class="verse-number">Verse ${verseNumber}</div>
                    <table class="word-table">
                        <thead>
                            <tr>
                                <th style="width: 40%;">Arabic Text</th>
                                <th style="width: 60%;">Description/Notes</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            words.forEach((word, wordIndex) => {
                // Decode the word for proper display in preview
                const decodedWord = this.decodeUnicodeText(word);
                const description = this.generateWordDescription(decodedWord, wordIndex, translation);
                previewHTML += `
                    <tr>
                        <td class="arabic-text">${decodedWord}</td>
                        <td class="description-text">${description}</td>
                    </tr>
                `;
            });
            
            previewHTML += `
                        </tbody>
                    </table>
                </div>
            `;
        });
        
        previewContent.innerHTML = previewHTML;
        previewSection.style.display = 'block';
    }

    hidePreview() {
        document.getElementById('previewSection').style.display = 'none';
    }

    // Decode Unicode escape sequences to proper Arabic text
    decodeUnicodeText(text) {
        try {
            // Handle Unicode escape sequences like \u0628\u0650\u0633
            return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } catch (error) {
            console.warn('Error decoding Unicode text:', error);
            return text;
        }
    }

    parseArabicWords(arabicText) {
        // First decode Unicode escape sequences, then split by spaces
        const decodedText = this.decodeUnicodeText(arabicText);
        return decodedText.split(/\s+/).filter(word => word.trim().length > 0);
    }

    generateWordDescription(word, index, verseTranslation) {
        const includeTransliteration = document.getElementById('includeTransliteration').checked;
        const includeTranslation = document.getElementById('includeTranslation').checked;
        const includeGrammar = document.getElementById('includeGrammar').checked;
        
        let description = '';
        
        if (includeTransliteration) {
            // This would ideally come from a real API
            const transliteration = this.getTransliteration(word);
            description += `<div class="transliteration">Transliteration: ${transliteration}</div>`;
        }
        
        if (includeTranslation) {
            // This would ideally come from a real word-by-word API
            const wordMeaning = this.getWordMeaning(word, index);
            description += `<div class="translation">Meaning: ${wordMeaning}</div>`;
        }
        
        if (includeGrammar) {
            // This would ideally come from a real grammatical analysis API
            const grammar = this.getGrammarNotes(word);
            description += `<div class="grammar">Grammar: ${grammar}</div>`;
        }
        
        return description || 'Word analysis';
    }

    // Mock functions - in a real implementation, these would connect to proper APIs
    getTransliteration(arabicWord) {
        const transliterations = {
            'بِسْمِ': 'bismi',
            'اللَّهِ': 'allahi',
            'الرَّحْمَٰنِ': 'ar-rahmani',
            'الرَّحِيمِ': 'ar-raheem',
            'الْحَمْدُ': 'alhamdu',
            'لِلَّهِ': 'lillahi',
            'رَبِّ': 'rabbi',
            'الْعَالَمِينَ': 'al-alameen'
        };
        return transliterations[arabicWord] || 'transliteration';
    }

    getWordMeaning(arabicWord, index) {
        const meanings = {
            'بِسْمِ': 'In the name of',
            'اللَّهِ': 'Allah',
            'الرَّحْمَٰنِ': 'The Most Gracious',
            'الرَّحِيمِ': 'The Most Merciful',
            'الْحَمْدُ': 'All praise',
            'لِلَّهِ': 'to Allah',
            'رَبِّ': 'Lord of',
            'الْعَالَمِينَ': 'the worlds'
        };
        return meanings[arabicWord] || `meaning of word ${index + 1}`;
    }

    getGrammarNotes(arabicWord) {
        const grammar = {
            'بِسْمِ': 'Noun, genitive case with preposition',
            'اللَّهِ': 'Proper noun, genitive case',
            'الرَّحْمَٰنِ': 'Adjective, genitive case',
            'الرَّحِيمِ': 'Adjective, genitive case',
            'الْحَمْدُ': 'Noun, nominative case',
            'لِلَّهِ': 'Prepositional phrase',
            'رَبِّ': 'Noun, genitive case (mudaf)',
            'الْعَالَمِينَ': 'Noun, genitive case (mudaf ilayh)'
        };
        return grammar[arabicWord] || 'Grammar analysis';
    }

    async generatePDF() {
        if (!this.currentSurahData) {
            this.showError('Please select a surah first.');
            return;
        }

        try {
            this.showGeneratingState();
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const verseStart = parseInt(document.getElementById('verseStart').value) || 1;
            const verseEnd = parseInt(document.getElementById('verseEnd').value) || this.currentSurahData.surah.ayahs.length;
            const filteredVerses = this.currentSurahData.surah.ayahs.slice(verseStart - 1, verseEnd);

            // Add title
            doc.setFontSize(18);
            doc.text(`${this.currentSurahData.surah.englishName}`, 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Verses ${verseStart} to ${verseEnd}`, 105, 30, { align: 'center' });
            doc.text('Word by Word Analysis', 105, 40, { align: 'center' });

            // Create one single table with all words from all verses
            const allTableData = [];
            
            for (let i = 0; i < filteredVerses.length; i++) {
                const ayah = filteredVerses[i];
                const verseNumber = verseStart + i;
                const words = this.parseArabicWords(ayah.text);

                // Add verse separator row
                if (i > 0) {
                    allTableData.push(['', '']); // Empty row as separator
                }
                
                // Add verse number row
                allTableData.push([`Verse ${verseNumber}`, '']);

                // Add all words from this verse
                words.forEach((word) => {
                    // Decode Unicode and use the proper Arabic text
                    const decodedWord = this.decodeUnicodeText(word);
                    allTableData.push([decodedWord, '']); // Empty description as requested
                });
            }

            // Create single table with all data
            doc.autoTable({
                startY: 50,
                head: [['Arabic Text', 'Description/Notes']],
                body: allTableData,
                theme: 'grid',
                styles: {
                    fontSize: 12,
                    cellPadding: 10,
                    textColor: [0, 0, 0],
                    lineColor: [128, 128, 128],
                    lineWidth: 0.2,
                    font: 'helvetica',
                    direction: 'rtl'
                },
                headStyles: {
                    fillColor: [143, 188, 143],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 14
                },
                columnStyles: {
                    0: { 
                        cellWidth: 80,
                        halign: 'right',
                        fontSize: 16,
                        fontStyle: 'normal',
                        font: 'helvetica',
                        // Better spacing for Arabic text
                        cellPadding: { top: 12, bottom: 12, left: 15, right: 15 }
                    },
                    1: { 
                        cellWidth: 100,
                        halign: 'left',
                        fontSize: 10,
                        // Ensure description column stays empty
                        cellPadding: { top: 12, bottom: 12, left: 15, right: 15 }
                    }
                },
                margin: { left: 15, right: 15 },
                tableWidth: 'wrap',
                // Custom row styling
                didParseCell: function (data) {
                    // Style verse number rows differently
                    if (data.cell.text[0] && data.cell.text[0].startsWith('Verse ')) {
                        data.cell.styles.fillColor = [200, 220, 200];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.halign = 'center';
                        data.cell.styles.fontSize = 12;
                    }
                    // Style empty separator rows
                    else if (data.cell.text[0] === '' && data.row.index > 0 && data.cell.text[0] !== 'Verse') {
                        data.cell.styles.fillColor = [248, 248, 248];
                        data.cell.styles.minCellHeight = 5;
                    }
                    
                    // Ensure Arabic text is properly aligned and sized
                    if (data.column.index === 0 && data.cell.text[0] && !data.cell.text[0].startsWith('Verse') && data.cell.text[0] !== '') {
                        data.cell.styles.halign = 'right';
                        data.cell.styles.fontSize = 16;
                        data.cell.styles.fontStyle = 'normal';
                        // Add more padding for better Arabic text display
                        data.cell.styles.cellPadding = { top: 15, bottom: 15, left: 20, right: 20 };
                    }
                    
                    // Ensure description column is truly empty and properly formatted
                    if (data.column.index === 1 && !data.cell.text[0].startsWith('Verse')) {
                        data.cell.text = [''];  // Force empty
                        data.cell.styles.fillColor = [255, 255, 255];
                    }
                },
                
                // Better handling of text rendering
                didDrawCell: function(data) {
                    // Custom Arabic text rendering if needed
                    if (data.column.index === 0 && data.cell.text[0] && !data.cell.text[0].startsWith('Verse') && data.cell.text[0] !== '') {
                        // The text is already rendered by autoTable, but we ensure it's right-aligned
                    }
                }
            });

            // Add footer
            const totalPages = doc.internal.getNumberOfPages();
            const pageHeight = doc.internal.pageSize.height;
            
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${totalPages}`, 105, pageHeight - 10, { align: 'center' });
                doc.text('Generated by Word by Word Quran PDF Generator', 105, pageHeight - 5, { align: 'center' });
            }

            // Save the PDF
            const fileName = `${this.currentSurahData.surah.englishName}_verses_${verseStart}-${verseEnd}.pdf`;
            doc.save(fileName);

            this.showSuccess(`PDF generated successfully: ${fileName}`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showError('Failed to generate PDF. Please try again.');
        } finally {
            this.hideGeneratingState();
        }
    }

    showGeneratingState() {
        const btn = document.getElementById('generatePdf');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('loadingSpinner');
        
        btn.disabled = true;
        btnText.textContent = 'Generating PDF...';
        spinner.style.display = 'block';
    }

    hideGeneratingState() {
        const btn = document.getElementById('generatePdf');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('loadingSpinner');
        
        btn.disabled = false;
        btnText.textContent = 'Generate PDF';
        spinner.style.display = 'none';
    }

    showLoading() {
        // Could add a loading state for preview
    }

    hideLoading() {
        // Hide loading state
    }

    showError(message) {
        // Simple alert for now - could be enhanced with a proper notification system
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Simple alert for now - could be enhanced with a proper notification system
        alert('Success: ' + message);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuranPDFGenerator();
});