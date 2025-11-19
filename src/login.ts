import { parseDocument } from "htmlparser2";
import { selectOne } from "css-select";
import { Element } from "domhandler";

type RespostaLogin = {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  expira_em?: number;
  error?: string;
};

/**
 * @param headers Cabeçalho da requisição
 * @returns Token da sessão atual.
 */
function getJSESSIONID(headers: Headers): string | undefined {
  const setCookieHeader = headers.get("set-cookie");
  if (!setCookieHeader) return undefined;

  const cookies = setCookieHeader.split(",").find((cookie) => cookie.includes("JSESSIONID"));

  if (!cookies) return undefined;
  return cookies.split(";")[0]?.split("=")[1];
}

/**
 * @param data O conteúdo HTML da página.
 * @returns O valor do ViewState, se encontrado, ou undefined.
 */
function getViewState(data: string): string | undefined {
  const doc = parseDocument(data);
  const input = selectOne("input[name='javax.faces.ViewState']", doc);
  if (input instanceof Element) return (input as Element).attribs.value;
  return undefined;
}

/**
 * Realiza a requisição de login.
 * @param username O nome de usuário.
 * @param password A senha.
 * @param viewState O token ViewState da página.
 * @param jsessionId O token da sessão.
 * @returns Uma promessa que resolve para um objeto RespostaLogin.
 */
async function fazerLoginPost(
  username: string,
  password: string,
  viewState: string,
  jsessionId: string
): Promise<RespostaLogin> {
  try {
    const formData = new URLSearchParams();
    formData.append("form", "form");
    formData.append("form:usuario", username);
    formData.append("form:senha", password);
    formData.append("javax.faces.ViewState", viewState);
    formData.append("javax.faces.source", "form:loginBtn:loginBtn");
    formData.append("javax.faces.partial.event", "click");
    formData.append("javax.faces.partial.execute", "form:loginBtn:loginBtn @component");
    formData.append("javax.faces.partial.render", "@component");
    formData.append("org.richfaces.ajax.component", "form:loginBtn:loginBtn");
    formData.append("form:loginBtn:loginBtn", "form:loginBtn:loginBtn");
    formData.append("rfExt", "null");
    formData.append("AJAX:EVENTS_COUNT", "1");
    formData.append("javax.faces.partial.ajax", "true");


    const response = await fetch("https://sei.unirv.edu.br/index.xhtml", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0",
        "Accept": "*/*",
        "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Faces-Request": "partial/ajax",
        "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Origin": "https://sei.unirv.edu.br",
        "Connection": "keep-alive",
        "Referer": "https://sei.unirv.edu.br/index.xhtml",
        "Cookie": `JSESSIONID=${jsessionId}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "DNT": "1",
        "Priority": "u=0"
      },
      body: formData.toString()
    });

    if (!response.ok) {
      return { sucesso: false, mensagem: `HTTP error! status: ${response.status}` };
    }

    const responseText = await response.text();
    if (!responseText.includes("redirect")) 
      return { sucesso: false, error: "Credenciais invalidas!" }
    
    return { sucesso: true, mensagem: "Login realizado com sucesso", token: jsessionId, expira_em: Date.now() + 2400000};
  } catch (error) {
    return { sucesso: false, error: `Error: ${error}` };
  }
}

export async function Login(username: string, password: string): Promise<RespostaLogin> {
  try {
    const loginRes = await fetch("https://sei.unirv.edu.br/", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0",
        Accept: "application/json",
      },
    });

    if (!loginRes.ok) {
      return { sucesso: false, mensagem: `HTTP error! status: ${loginRes.status}` };
    }

    const JSESSIONID = getJSESSIONID(loginRes.headers);
    if (!JSESSIONID) return { sucesso: false, mensagem: "Não conseguiu achar JSESSIONID" };

    const htmlData = await loginRes.text();
    const viewState = getViewState(htmlData);
    if (!viewState) return { sucesso: false, mensagem: "Não conseguiu achar viewState" };

    return await fazerLoginPost(username, password, viewState, JSESSIONID);
  } catch (error) {
    return { sucesso: false, error: `Error: ${error}` };
  }
}