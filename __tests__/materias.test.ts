import { MateriasPeriodoAtual } from "../dist/materias";
import { getCronograma } from "../dist/cronograma";
import { tryLogin } from "./login.test";

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
