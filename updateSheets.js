const { google } = require('googleapis');
const fs = require('fs');

// Carregar credenciais do arquivo local
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8';

async function updateGoogleSheets() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Autenticado com sucesso! Atualizando Google Sheets...');

    // Ler arquivos filtrados
    const activeUsers = JSON.parse(fs.readFileSync('activeUsers.json', 'utf8'));
    const nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json', 'utf8'));

    const activeData = activeUsers.map(user => [user.name, user.email]);
    const nonActiveData = nonActiveUsers.map(user => [user.name, user.email]);

    // Atualizar aba de usuários ativos
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ativos!A1',
      valueInputOption: 'RAW',
      resource: { values: [['Nome', 'Email'], ...activeData] },
    });

    // Atualizar aba de usuários não ativos
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

// Executar a função principal
updateGoogleSheets();
