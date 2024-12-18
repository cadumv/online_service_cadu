const { google } = require('googleapis');

// Carregar credenciais a partir do GitHub Secrets
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const SPREADSHEET_ID = '1oF9WFtv53BPmSZI53GZ7tBud9cnMVOAwnMEY5g_0-l8';

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function updateGoogleSheets() {
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Autenticado com sucesso! Atualizando Google Sheets...');
  // Aqui segue a lógica de leitura dos arquivos e atualização da planilha
}

updateGoogleSheets().catch(console.error);
