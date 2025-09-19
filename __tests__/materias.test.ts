import { MateriasPeriodoAtual } from "../dist/materias";
import { getCronograma } from "../dist/cronograma";
import { Login } from "../dist/login";
import { exitCode } from "process";


async function tryLogin() {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;

  if (!username || !password)
    throw new Error("As variáveis de ambiente APP_USERNAME e APP_PASSWORD devem ser definidas para este teste.");

  return await Login(username, password);
}

describe("materias", () => {
  it("deve conseguir as materias do usuário", async () => {
    const res = await tryLogin();

    if (res.sucesso && res.token) {
      const materias = await MateriasPeriodoAtual(res.token);
      expect(materias).toBeDefined();
      expect(materias?.length).toBeGreaterThan(0);
    }
  }, 30000);

  it("deve falar que o TOKEN está invalido", async () => {
    await expect(MateriasPeriodoAtual("TOKEN_INVALIDO")).rejects.toThrow(
      "Erro ao buscar as matérias: Credenciais invalidas!"
    );
  });
});

describe("cronograma", () => {
  it("deve conseguir o cronograma do usuário", async () => {
    const res = await tryLogin();
    
    if (res.sucesso && res.token) {
      const cronograma = await getCronograma(res.token);
      expect(cronograma).toBeDefined();
    }
  }, 30000);

  it("deve falar que o TOKEN está invalido", async () => {
    await expect(getCronograma("TOKEN_INVALIDO")).rejects.toThrow(
      "Erro ao buscar o cronograma: Credenciais invalidas!"
    );
  }, 30000);
});
