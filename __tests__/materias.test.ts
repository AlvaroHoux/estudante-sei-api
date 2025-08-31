import { MateriasPeriodoAtual } from "../dist/materias";
import { Login } from "../dist/login";
import { exitCode } from "process";

describe("materias", () => {
  it("deve conseguir as materias do usuário", async () => {
    const username = process.env.APP_USERNAME;
    const password = process.env.APP_PASSWORD;

    if (!username || !password)
      throw new Error("As variáveis de ambiente APP_USERNAME e APP_PASSWORD devem ser definidas para este teste.");

    const res = await Login(username, password);
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
