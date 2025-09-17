import { fetchConfig } from "./seiApiConfig.js";
import { parseDocument } from "htmlparser2";
import { selectAll, selectOne } from "css-select";
import { Node, Element, Text } from "domhandler";

enum Seletores {
  MaterialAtual = "div.w-100.p-2.border-bottom",
  NomeDaMateria = "div.col-md-12 > span.tituloCampos.fs12[title]",
  TurmaPratica = "span.field.control-label.tituloCampos.fs10[title='Turma Prática']",
  TurmaTeorica = "span.field.control-label.tituloCampos.fs10[title='Turma Teórica']",
  PeriodoEstudo = "div.col-md-5.text-left > span.field.control-label.tituloCampos.fs10",
  Status = "div.col-md-3.text-right > span.field.control-label.tituloCampos.fs10.pull-right",
}

type Materia = {
  codigo?: string;
  nomeDaMateria?: string;
  professor?: string[];
  periodoEstudoInicio?: string;
  periodoEstudoFim?: string;
  turmaPratica?: string;
  turmaTeorica?: string;
  frequencia?: number;
  status?: string;
};

/**
 * Busca as matérias do período atual do aluno.
 *
 * @param TOKEN O token de sessão (JSESSIONID) para autenticação.
 * @returns Uma promessa que resolve para um array de objetos `Materia`.
 * @throws Lança uma exceção se a requisição HTTP falhar, se as credenciais forem inválidas, ou se ocorrer um erro durante o parsing do HTML.
 */
export async function MateriasPeriodoAtual(TOKEN: string): Promise<Materia[]> {
  try {
    const res = await fetch(
      "https://sei.unirv.edu.br/visaoAluno/telaInicialVisaoAluno.xhtml",
      fetchConfig("GET", TOKEN, "https://sei.unirv.edu.br/visaoAluno/telaInicialVisaoAluno.xhtml")
    );

    if (!res.ok) {
      throw new Error(`Erro na requisição HTTP: ${res.status} ${res.statusText}`);
    }

    const htmlData = await res.text();
    const doc = parseDocument(htmlData);

    if (!htmlData.includes("redirect")) throw new Error("Credenciais invalidas!");

    const getText = (node: Node | null): string => {
      if (!node) return "";
      if (node instanceof Element && node.firstChild?.type === "text") {
        return (node.firstChild as Text).data.trim();
      }
      return "";
    };

    let materias: Materia[] = [];

    let i = 0;
    for (const materiaAtual of selectAll(Seletores.MaterialAtual, doc)) {
      const nomeMateria = selectOne(Seletores.NomeDaMateria, materiaAtual);
      const professor = nomeMateria instanceof Element ? (nomeMateria as Element).attribs.title : "";
      const turmaPratica = selectOne(Seletores.TurmaPratica, materiaAtual);
      const turmaTeorica = selectOne(Seletores.TurmaTeorica, materiaAtual);
      const periodoEstudo = selectOne(Seletores.PeriodoEstudo, materiaAtual);
      const frequencia = selectOne(`span#form\\:j_idt699\\:${i}\\:frequencia`, doc);
      const status = selectOne(Seletores.Status, materiaAtual);

      const codigoNomeMateria = /(\d+ - .+?)\s(.+)/g.exec(getText(nomeMateria));
      const periodos = [...getText(periodoEstudo).matchAll(/\d{2}\/\d{2}\/\d{2}/g)].map((x) => x[0]);

      materias.push({
        codigo: codigoNomeMateria?.[1] ?? "",
        nomeDaMateria: codigoNomeMateria?.[2] ?? "",
        professor: professor?.split(", ") ?? [],
        turmaPratica: /T. Prática: (.+)/g.exec(getText(turmaPratica))?.[1] ?? "",
        turmaTeorica: /T. Teórica: (.+)/g.exec(getText(turmaTeorica))?.[1] ?? "",
        frequencia: Number.parseFloat(/Freq.: (.*)\(/g.exec(getText(frequencia))?.[1] ?? "0"),
        periodoEstudoInicio: periodos[0] ?? "",
        periodoEstudoFim: periodos[1] ?? "",
        status: getText(status),
      });
      i++;
    }
    return materias;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar as matérias: ${error.message}`);
    }
    throw new Error(`Ocorreu um erro desconhecido ao buscar as matérias: ${String(error)}`);
  }
}
