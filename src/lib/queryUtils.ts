export function pagingQuerySelection(
  tableAlias: string,
  cols: string[]
): { countCols: string[]; dataCols: string[] } {
  return {
    countCols: [
      `COUNT(*) AS cnt`,
      ...cols.map((colName) => `NULL AS ${colName}`),
    ],
    dataCols: [
      `NULL AS cnt`,
      ...cols.map((colName) => `${tableAlias}.${colName} AS ${colName}`),
    ],
  };
}
