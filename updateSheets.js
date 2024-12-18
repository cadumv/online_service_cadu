const { google } = require('googleapis');
const fs = require('fs');

// Caminho para o arquivo de credenciais JSON
const KEYFILE = 'credentials.json'; // Certifique-se de que o caminho está correto
const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8'; // Substitua pelo ID da sua planilha

async function updateGoogleSheets() {
  try {
    // Autenticação com Google API
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Autenticado com sucesso! Lendo arquivos...');

    // Ler os arquivos filtrados
    const activeUsers = JSON.parse(fs.readFileSync('activeUsers.json', 'utf-8'));
    const nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json', 'utf-8'));

    const activeData = activeUsers.map(user => [user.name, user.email]);
    const nonActiveData = nonActiveUsers.map(user => [user.name, user.email]);

    // Atualizar aba de usuários ativos
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ativos!A1',
      valueInputOption: 'RAW',
      resource: { values: [['Nome', 'Email'], ...activeData] }
    });
    console.log('Dados de usuários ativos atualizados!');

    // Atualizar aba de usuários não ativos
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'NaoAtivos!A1',
      valueInputOption: 'RAW',
      resource: { values: [['Nome', 'Email'], ...nonActiveData] }
    });
    console.log('Dados de usuários não ativos atualizados!');

  } catch (error) {
    console.error('Erro ao atualizar Google Sheets:', error);
  }
}

updateGoogleSheets();
