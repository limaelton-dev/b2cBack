import { Repository } from 'typeorm';
import { generateSlug } from './category.util';

/**
 * Gera um slug único para produto, adicionando um sufixo numérico se necessário
 * @param name Nome do produto
 * @param oracleId ID do produto no Oracle
 * @param repository Repositório de produtos para verificar existência do slug
 * @returns Slug único
 */
export async function generateUniqueProductSlug(
  name: string,
  oracleId: number,
  repository: Repository<any>
): Promise<string> {
  // Gera o slug base
  const baseSlug = generateSlug(name);
  
  // Verifica se o slug já existe
  const existingProduct = await repository.findOne({
    where: { slug: baseSlug }
  });
  
  // Se não existir, retorna o slug base
  if (!existingProduct) {
    return baseSlug;
  }

  // Se existir, adiciona o oracleId como sufixo para torná-lo único
  const uniqueSlug = `${baseSlug}-${oracleId}`;
  
  // Verifica se mesmo o slug com o oracleId já existe
  const existingWithSuffix = await repository.findOne({
    where: { slug: uniqueSlug }
  });
  
  // Se não existir, retorna o slug com sufixo
  if (!existingWithSuffix) {
    return uniqueSlug;
  }
  
  // Se mesmo com o oracleId ainda houver conflito, adiciona um timestamp
  const timestamp = new Date().getTime();
  return `${baseSlug}-${oracleId}-${timestamp}`;
} 