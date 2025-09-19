import selectAll, { selectOne } from "css-select";
import { fetchConfig } from "./seiApiConfig.js";
import { Disciplina } from "./cronograma.js";
import { parseDocument } from "htmlparser2";
import { Document, Text } from "domhandler";

const CRONOGRAMA_URL = "https://sei.unirv.edu.br/visaoAluno/minhasNotasAlunos.xhtml";
const REFERER_URL = "https://sei.unirv.edu.br/visaoAluno/telaInicialVisaoAluno.xhtml";

type Notas = {
  av1?: number;
  av2?: number;
  av3?: number;
};

type DisciplinaNota = Disciplina & {
  frequencia?: string;
  mediaFinal?: string;
  situacao?: string;
  notas?: Notas;
};

/**
 * Extrai o conteúdo de texto de uma célula específica da tabela.
 * @param line O índice da linha.
 * @param column O índice da coluna.
 * @param table O elemento da tabela para extrair o texto.
 * @returns O conteúdo de texto da célula.
 */
const getText = (line: number, column: number, table: Document) =>
  (selectOne(`tr:nth-child(${line + 1}) td:nth-child(${column + 1}) > span`, table)?.firstChild as Text)?.data.trim();

/**
 * Analisa as notas (AV1, AV2, AV3) de uma disciplina a partir do HTML.
 * @param row O elemento da linha da tabela que contém os dados da disciplina.
 * @returns Um objeto com as notas analisadas.
 */
const parseNotas = (row: Document): Notas => {
  const notasNode = selectOne(`td:nth-child(4) > div`, row);
  const notasAtuais: Notas = {};
  const avs = ["av1", "av2", "av3"] as const;

  if (notasNode) {
    for (let i = 0; i < notasNode.children.length - 1; i++) {
      const notaAtualNode = selectOne(`div:nth-child(${i + 1}) > span:nth-child(2)`, notasNode);
      const notaKey = avs[i];
      if (notaKey && notaAtualNode?.firstChild) {
        const notaValue = (notaAtualNode.firstChild as Text).data.trim();
        notasAtuais[notaKey] = Number.parseInt(notaValue, 10) || 0;
      }
    }
  }
  return notasAtuais;
};

/**
 * Busca e analisa as notas do aluno no portal do SEI.
 *
 * @param TOKEN O token de autenticação para a sessão.
 * @returns Uma promessa que resolve para um array de objetos, cada um representando uma disciplina com suas notas.
 * @throws Um erro se a requisição falhar ou se os dados não puderem ser analisados.
 */
export async function getNotas(TOKEN: string): Promise<DisciplinaNota[]> {
  try {
    const res = await fetch(CRONOGRAMA_URL, fetchConfig("GET", TOKEN, REFERER_URL));

    if (!res.ok) {
      throw new Error(`Erro na requisição HTTP: ${res.status} ${res.statusText}`);
    }

    const htmlData = await res.text();
    const doc = parseDocument(htmlData);

    if (!htmlData.includes("redirect")) throw new Error("Credenciais invalidas!");

    const tabelaMaterias = selectAll("tbody", doc)[1] as Document;
    const rows = selectAll("tr", tabelaMaterias);

    return rows.map((row, i) => {
      const codigoMatch = /(.+?)\s(.+)/.exec(getText(i, 1, tabelaMaterias) ?? "");
      return {
        turma: getText(i, 0, tabelaMaterias) ?? "",
        codigo: codigoMatch?.[1] ?? "",
        nome: codigoMatch?.[2] ?? "",
        frequencia: getText(i, 2, tabelaMaterias) ?? "",
        notas: parseNotas(row),
        mediaFinal: getText(i, 4, tabelaMaterias) ?? "",
        situacao: getText(i, 5, tabelaMaterias) ?? "",
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar as notas: ${error.message}`);
    }
    throw new Error(`Ocorreu um erro desconhecido ao buscar as notas: ${String(error)}`);
  }
}
