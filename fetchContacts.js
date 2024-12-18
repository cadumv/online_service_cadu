const fetch = require('node-fetch');
const fs = require('fs');

// Configurações de Autenticação
const base64Auth = "Basic N2JkMzFiYTQtYjIwZS00NTU3LTgwYTMtYzFiNTM5YWU3NmZiOmYxOTUyN2U4LWY0NTktNGE2My05YTZjLWFkNDE1ZjhiNDcwOQ=="; // Sua chave codificada
const urlToken = "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials";

// Configuração da API
const subdomain = "marketingparaengenheiro-ygppnd";
const baseURL = `https://developers.hotmart.com/club/api/v1/users?subdomain=${subdomain}`;

// Função para obter o access_token
async function getAccessToken() {
    const response = await fetch(urlToken, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": base64Auth
        }
    });

    const data = await response.json();

    // Verifica se o token existe
    if (!data.access_token) {
        throw new Error("A resposta não contém um access_token válido.");
    }

    console.log("Access token obtido com sucesso!");
    return data.access_token;
}

// Função para buscar todos os alunos com paginação
async function fetchAllUsers(accessToken) {
    let pageToken = "";
    let allUsers = [];

    while (true) {
        const url = pageToken ? `${baseURL}&page_token=${pageToken}` : baseURL;

        console.log(`Buscando página: ${url}`);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (data.items) {
            allUsers.push(...data.items);
        }

        if (data.page_info && data.page_info.next_page_token) {
            pageToken = data.page_info.next_page_token;
        } else {
            break; // Sai do loop quando não houver mais páginas
        }
    }

    return allUsers;
}

// Executa o fluxo completo
(async () => {
    try {
        console.log("Obtendo access_token...");
        const accessToken = await getAccessToken();

        console.log("Buscando todos os usuários...");
        const users = await fetchAllUsers(accessToken);

        console.log(`Total de usuários encontrados: ${users.length}`);

        // Salva os usuários em um arquivo JSON
        fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
        console.log("Usuários salvos no arquivo 'users.json'");

    } catch (error) {
        console.error("Erro:", error.message);
    }
})();
