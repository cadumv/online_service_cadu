const axios = require('axios');
const fs = require('fs');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby47dQhXjcHJytkPGYgp49CYm-_MVjTCtVeKFIwQeriNlN78z3UDV-Try9MecrNeqI_/exec';

// Ler os dados dos arquivos JSON
const activeUsers = JSON.parse(fs.readFileSync('activeUsers.json', 'utf8'));
const nonActiveUsers = JSON.parse(fs.readFileSync('nonActiveUsers.json', 'utf8'));

// Dados no formato esperado pelo Webhook
const data = {
  activeUsers: activeUsers.map(user => [user.name, user.email]),
  nonActiveUsers: nonActiveUsers.map(user => [user.name, user.email]),
};

// Enviar para o Webhook
axios.post(WEBHOOK_URL, data)
  .then(response => {
    console.log('Google Sheets atualizado com sucesso:', response.data);
  })
  .catch(error => {
    console.error('Erro ao atualizar Google Sheets:', error.response ? error.response.data : error.message);
  });
