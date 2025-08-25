import { Login } from "../dist/login";

describe("login", () => {
  it("deve fazer login com sucesso com credenciais válidas", async () => {
    const username = process.env.APP_USERNAME;
    const password = process.env.APP_PASSWORD;

    if (!username || !password)
      throw new Error("As variáveis de ambiente USERNAME e PASSWORD devem ser definidas para este teste.");

    const res = await Login(username, password);

    expect(res.sucesso).toBe(true);
    expect(res.mensagem).toBe("Login realizado com sucesso");
    expect(res.token).toBeDefined();
  }, 30000);

  it("deve fazer login com credenciais invalidas", async () => {
    const test_username = "teste";
    const test_password = "teste";

    const res = await Login(test_username, test_password);

    expect(res.sucesso).toBe(false);
    expect(res.error).toMatch(/invalida/i);
  }, 30000);
});
