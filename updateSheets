const { google } = require('googleapis');
const fs = require('fs');

// Caminho para o arquivo de credenciais JSON
const KEYFILE = 'credentials.json'; // Substitua com o nome do seu arquivo de credenciais
const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8'; // Substitua pelo ID da sua planilha

// Autenticação com Google API
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

async function updateGoogleSheets() {
  const sheets = google.sheets({ version: 'v4', auth });

  // Ler os arquivos filtrados
  const activeUsers = JSON.parse(fs.readFileSync('activeUsers.json'));
  const nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json'));

  const activeData = activeUsers.map(user => [user.name, user.email]);
  const nonActiveData = nonActiveUsers.map(user => [user.name, user.email]);

  // Atualizar aba de usuários ativos
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ativos!A1',
    valueInputOption: 'RAW',
    resource: { values: [['Nome', 'Email'], ...activeData] }
  });

  // Atualizar aba de usuários não ativos
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'NaoAtivos!A1',
    valueInputOption: 'RAW',
    resource: { values: [['Nome', 'Email'], ...nonActiveData] }
  });

  console.log('Google Sheets atualizado com sucesso!');
}

updateGoogleSheets().catch(console.error);
