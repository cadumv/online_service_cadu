const { google } = require('googleapis');
const fs = require('fs');

// Carregar credenciais do arquivo
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8';

async function updateGoogleSheets() {
    try {
        console.log('Autenticado com sucesso! Atualizando Google Sheets...');

        const activeUsers = JSON.parse(fs.readFileSync('activeUsers.json', 'utf8'));
        const nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json', 'utf8'));

        const activeData = activeUsers.map(user => [user.name, user.email]);
        const nonActiveData = nonActiveUsers.map(user => [user.name, user.email]);

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Ativos!A1',
            valueInputOption: 'RAW',
            resource: { values: [['Nome', 'Email'], ...activeData] },
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'NaoAtivos!A1',
            valueInputOption: 'RAW',
            resource: { values: [['Nome', 'Email'], ...nonActiveData] },
        });

        console.log('Google Sheets atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar Google Sheets:', error.message);
        process.exit(1);
    }
}

updateGoogleSheets();
