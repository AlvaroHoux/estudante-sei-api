/**
 * Cria um objeto de configuração `RequestInit` para fazer requisições à API do SEI.
 *
 * @param METHOD O método HTTP para a requisição (ex: "GET", "POST").
 * @param TOKEN O token de sessão (JSESSIONID) para autenticação.
 * @param REFERER O URL de referência para a requisição.
 * @returns Um objeto `RequestInit` configurado para ser usado com a API `fetch`.
 */
export const fetchConfig = (METHOD: string, TOKEN: string, REFERER: string): RequestInit => {
  return {
    method: METHOD,
    headers: {
      Host: "sei.unirv.edu.br",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      DNT: "1",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      Referer: REFERER,
      Cookie: `JSESSIONID=${TOKEN}`,
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
    },
  };
};
