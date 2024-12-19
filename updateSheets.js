const { google } = require('googleapis');
const fs = require('fs');

// Carregar credenciais
let credentials;
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  } else {
    throw new Error('Variável GOOGLE_CREDENTIALS não definida.');
  }
} catch (error) {
  console.error('Erro ao carregar as credenciais:', error.message);
  process.exit(1);
}

console.log('Credenciais carregadas com sucesso.');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8';

async function updateGoogleSheets() {
  console.log('Autenticado com sucesso! Atualizando Google Sheets...');

  // Ler os arquivos filtrados
  let activeUsers, nonActiveUsers;
  try {
    activeUsers = JSON.parse(fs.readFileSync('activeUsers.json', 'utf8'));
    nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json', 'utf8'));
    console.log(`${activeUsers.length} usuários ativos carregados.`);
    console.log(`${nonActiveUsers.length} usuários não ativos carregados.`);
  } catch (error) {
    console.error('Erro ao carregar arquivos JSON:', error.message);
    process.exit(1);
  }

  const activeData = activeUsers.map(user => [user.name, user.email]);
  const nonActiveData = nonActiveUsers.map(user => [user.name, user.email]);

  try {
    // Atualizar aba de usuários ativos
    console.log('Atualizando aba "Ativos" no Google Sheets...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ativos!A1',
      valueInputOption: 'RAW',
      resource: { values: [['Nome', 'Email'], ...activeData] },
    });

    // Atualizar aba de usuários não ativos
    console.log('Atualizando aba "NaoAtivos" no Google Sheets...');
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

updateGoogleSheets().catch(error => {
  console.error('Erro ao executar a atualização:', error.message);
  process.exit(1);
});
