import { selectAll, selectOne } from "css-select";
import { fetchConfig } from "./seiApiConfig.js";
import { parseDocument } from "htmlparser2";
import { Document } from "domhandler";

type Disciplina = {
  horaInicio?: string;
  horaFim?: string;
  codigo?: string;
  nome?: string;
  turma?: string;
  professor?: string;
  sala?: string;
};

type DiaDaSemana = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado";

type Cronograma = {
  [K in DiaDaSemana]: Disciplina[];
};

const CRONOGRAMA_URL = "https://sei.unirv.edu.br/visaoAluno/meusHorariosAluno.xhtml";
const REFERER_URL = "https://sei.unirv.edu.br/visaoAluno/telaInicialVisaoAluno.xhtml";
const TABELA_SELECTOR = "td[id*='horarioAulaTurnoSemana']";

/**
 * Extrai o conteúdo de texto de uma lista de elementos.
 *
 * @param {Document[]} spans - Um array de elementos DOM (ou objetos semelhantes) dos quais o texto será extraído.
 * @returns {string[]} Um array contendo o texto extraído de cada elemento.
 */
function extractTextFromSpans(spans: Document[]): string[] {
  return spans
    .map((span) => {
      if (span?.firstChild?.type === "text") {
        const text = span.firstChild.data.trim();
        if (text) return text;
      }
      return "";
    })
    .filter((text) => text);
}

/**
 * Analisa (faz o "parse") um array de strings contendo os dados de uma matéria
 * e o converte em um objeto estruturado do tipo Disciplina.
 *
 * @param {string[]} dadosMateria - Array de strings com as informações da disciplina (ex: nome, professor, sala).
 * @returns {Disciplina} Um objeto do tipo 'Disciplina' com os dados devidamente formatados.
 */
function parseDisciplina(dadosMateria: string[]): Disciplina {
  const hora = dadosMateria[0]?.split("à");
  const disciplina: Disciplina = {
    horaInicio: hora?.[0]?.trim() ?? "",
    horaFim: hora?.[1]?.trim() ?? "",
  };

  if (dadosMateria.length === 2) {
    disciplina.nome = dadosMateria[1] ?? "";
  } else {
    const codigoMatch = /Disciplina: (.+?)\s(.+)/.exec(dadosMateria[1] ?? "");
    disciplina.codigo = codigoMatch?.[1] ?? "";
    disciplina.nome = codigoMatch?.[2] ?? "";
    disciplina.turma = dadosMateria[2]?.split(":")[1]?.trim() ?? "";
    disciplina.professor = dadosMateria[3]?.split(":")[1]?.trim() ?? "";
    disciplina.sala = dadosMateria[4]?.split(":")[1]?.trim() ?? "";
  }

  return disciplina;
}

/**
 * Busca o cronograma de aulas de forma assíncrona utilizando um token de autenticação.
 *
 * @async
 * @param {string} TOKEN - O token de autenticação necessário para acessar a API ou o serviço.
 * @returns {Promise<Cronograma>} Uma Promise que resolve com os dados do cronograma.
 * @throws {Error} Lança um erro se a requisição falhar ou se o token for inválido.
 */
export async function getCronograma(TOKEN: string): Promise<Cronograma> {
  try {
    const res = await fetch(CRONOGRAMA_URL, fetchConfig("GET", TOKEN, REFERER_URL));

    if (!res.ok) {
      throw new Error(`Erro na requisição HTTP: ${res.status} ${res.statusText}`);
    }

    const htmlData = await res.text();
    const doc = parseDocument(htmlData);

    const tabela = selectOne(TABELA_SELECTOR, doc);
    if (!tabela) {
      throw new Error("Credenciais invalidas!");
    }

    const dia_semana: Cronograma = {
      Segunda: [],
      Terça: [],
      Quarta: [],
      Quinta: [],
      Sexta: [],
      Sábado: [],
    };

    const dias = Object.keys(dia_semana) as Array<keyof Cronograma>;
    
    for (const linha of selectAll("tr", tabela)) {
      selectAll("td", linha).forEach((coluna, diaIndex) => {
        const dia_atual = dias[diaIndex];
        if (!dia_atual) return;

        const spanElements = selectAll("span", coluna);
        const dadosMateria = extractTextFromSpans(spanElements);

        if (dadosMateria.length > 0) {
          const disciplina = parseDisciplina(dadosMateria);
          dia_semana[dia_atual]?.push(disciplina);
        }
      });
    }
    return dia_semana;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar o cronograma: ${error.message}`);
    }
    throw new Error(`Ocorreu um erro desconhecido ao buscar o cronograma: ${String(error)}`);
  }
}
