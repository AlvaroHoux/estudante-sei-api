import axios from "axios";

type RespostaLogin = {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  error?: string;
};

/**
 * Encontra o token da sessão atual no cabeçalho.
 * @param loginRes Resposta da requisição de Login.
 * @returns Token da sessão atual.
 */
function getJSESSIONID(loginRes: axios.AxiosResponse<any, any>): string | undefined {
  const cookies = loginRes.headers["set-cookie"]?.find((cookie) => cookie.includes("JSESSIONID"));
  if (!cookies) return undefined;
  return cookies.split(";")[0]?.split("=")[1];
}

export async function Login(username: String, password: String): Promise<RespostaLogin> {
  try {
    const loginRes = await axios.get("https://sei.unirv.edu.br/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0",
        Accept: "application/json",
      },
    });

    const JSESSIONID = getJSESSIONID(loginRes);
    if (!JSESSIONID) return { sucesso: false, mensagem: "Não conseguiu achar JSESSIONID" };

    return { sucesso: true, mensagem: "teste" };
  } catch (error) {
    return { sucesso: false, error: `Error: ${error}` };
  }
}
