import { Login } from "../dist/login";
import dotenv from "dotenv";

dotenv.config();

describe("login", () => {
  it(
    "deve fazer login com sucesso com credenciais válidas",
    async () => {
      const username = process.env.USERNAME;
      const password = process.env.PASSWORD;

      if (!username || !password) {
        throw new Error("As variáveis de ambiente USERNAME e PASSWORD devem ser definidas para este teste.");
      }

      const res = await Login(username, password);

      expect(res.sucesso).toBe(true);
      expect(res.mensagem).toBe("Login realizado com sucesso");
      expect(res.token).toBeDefined();
    }, 30000);
});
