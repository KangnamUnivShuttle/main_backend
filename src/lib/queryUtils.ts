import { getManager } from "typeorm";
import logger from "../logger";

export function pagingQuerySelection(
  tableAlias: string,
  cols: string[],
  cntCol: string = "*"
): { countCols: string[]; dataCols: string[] } {
  return {
    countCols: [
      `COUNT(${cntCol}) AS cnt`,
      ...cols.map((colName) => `NULL AS ${colName}`),
    ],
    dataCols: [
      `NULL AS cnt`,
      ...cols.map((colName) => `${tableAlias}.${colName} AS ${colName}`),
    ],
  };
}

export function pagingUnionQuery(
  cntQuery: string,
  dataQuery: string,
  params: any[] = []
) {
  const entityManager = getManager();
  const query = `SELECT * FROM (${cntQuery}) AS CntRow UNION SELECT * FROM (${dataQuery}) AS DataRow`;
  logger.debug(`[queryUtils] [pagingUnionQuery] query: ${query}`);
  return entityManager.query(query, params);
}
