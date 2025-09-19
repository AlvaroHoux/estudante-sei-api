import { getNotas } from "../src/notas";
import { tryLogin } from "./login.test";

describe("notas", () => {
  it("deve conseguir as notas do usuário e verificar a estrutura", async () => {
    const res = await tryLogin();
    if (res.sucesso && res.token) {
      const notas = await getNotas(res.token);
      expect(notas).toBeDefined();
      expect(Array.isArray(notas)).toBe(true);

      if (notas.length > 0) {
        const firstNota = notas[0];
        expect(firstNota).toHaveProperty("turma");
        expect(firstNota).toHaveProperty("codigo");
        expect(firstNota).toHaveProperty("nome");
        expect(firstNota).toHaveProperty("frequencia");
        expect(firstNota).toHaveProperty("notas");
        expect(firstNota).toHaveProperty("mediaFinal");
        expect(firstNota).toHaveProperty("situacao");

        if (firstNota.notas) {
          expect(typeof firstNota.notas).toBe("object");
          const hasGrade =
            firstNota.notas.hasOwnProperty("av1") ||
            firstNota.notas.hasOwnProperty("av2") ||
            firstNota.notas.hasOwnProperty("av3");
          if (Object.keys(firstNota.notas).length > 0) {
            expect(hasGrade).toBe(true);
          }
        }
      }
    }
  }, 30000);

  it("deve falar que o TOKEN está invalido para as notas", async () => {
    await expect(getNotas("TOKEN_INVALIDO")).rejects.toThrow(
      "Erro ao buscar as notas: Credenciais invalidas!"
    );
  }, 30000);
});
