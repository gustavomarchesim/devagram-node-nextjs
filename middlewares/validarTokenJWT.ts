import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostasPadroes } from '../types/respostasPadroes';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

/**
 * Função responsável por validar o token JWT recebido na requisição.
 * 
 * @param handler - O manipulador da API Next.js
 * @returns - A função de manipulador da API com a validação do token JWT
 */

export const validarTokenJWT = (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<respostasPadroes>) => {

    // Verifica se a chave JWT está definida no ambiente
    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
      return res.status(500).json({ erro: 'ENV JWT não informada!' });
    }
    
    // Verifica se a requisição ou os cabeçalhos estão ausentes
    if (!req || !req.headers) {
      return res.status(401).json({ erro: 'Não foi possível validar o Token de acesso!' });
    }

    // Verifica se o método da requisição é diferente de OPTIONS
    if (req.method !== 'OPTIONS') {
      // Obtém o token de autorização do cabeçalho
      const authorization = req.headers['authorization'];
      if (!authorization) {
        return res.status(401).json({ erro: 'Não foi possível validar o Token de acesso!' });
      }
    
      // Extrai o token do cabeçalho
      const token = authorization?.substring(7);
      if (!token) {
        return res.status(401).json({ erro: 'Não foi possível validar o Token de acesso!' });
      }

      // Verifica e decodifica o token JWT usando a chave JWT
      const decoded = jwt.verify(token, MINHA_CHAVE_JWT as Secret) as JwtPayload;
      if (!decoded) {
        return res.status(401).json({ erro: 'Não foi possível validar o Token de acesso!' });
      }

      // Define o parâmetro de consulta userId com o valor do ID decodificado
      if (!req.query) {
        req.query = {};
      }
      req.query.userId = decoded._id;
    }

    // Executa o manipulador da API original
    return handler(req, res);
}