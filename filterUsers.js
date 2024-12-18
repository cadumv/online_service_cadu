const fs = require('fs');

// Lê o arquivo users.json
fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  // Converte o JSON em objeto JavaScript
  const users = JSON.parse(data);

  // Filtra usuários ativos
  const activeUsers = users.filter(user => user.status === 'ACTIVE');

  // Filtra usuários não ativos (bloqueados ou outros status)
  const nonActiveUsers = users.filter(user => user.status !== 'ACTIVE');

  // Mostra a quantidade de cada grupo
  console.log(`Quantidade de Usuários Ativos: ${activeUsers.length}`);
  console.log(`Quantidade de Usuários Não Ativos: ${nonActiveUsers.length}`);

  // Salva os dados filtrados em arquivos separados (opcional)
  fs.writeFileSync('activeUsers.json', JSON.stringify(activeUsers, null, 2));
  fs.writeFileSync('nonActiveUsers.json', JSON.stringify(nonActiveUsers, null, 2));

  console.log('Usuários filtrados foram salvos nos arquivos: activeUsers.json e nonActiveUsers.json');
});
