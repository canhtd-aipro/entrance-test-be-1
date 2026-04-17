import { isArray, isObject } from "lodash";
import { FindManyOptions } from "typeorm";

export type SelectMap = Record<number, string[] | string[][]>;

export const addSelect = <E = any>(options: FindManyOptions<E>, selectMap: SelectMap, config: number[]) => {
  const selectAllColumns: string[][] = [];

  const addSelectForColumn = (d: string[]) => {
    let relationsNode: any = { ...options.relations };
    options.relations = relationsNode;
    for (let i = 0; i < d.length - 1; i++) {
      const relationsNext = {
        ...relationsNode[d[i]],
      };
      relationsNode[d[i]] = relationsNext;
      relationsNode = relationsNext;
    }

    let selectNode: any = { ...options.select };
    options.select = selectNode;
    for (let i = 0; i < d.length - 1; i++) {
      const selectNext = {
        id: true,
        ...selectNode[d[i]],
      };
      selectNode[d[i]] = selectNext;
      selectNode = selectNext;
    }
    const field = d.at(-1)!;
    if (field === "*") {
      selectAllColumns.push(d);
    } else {
      selectNode[field] = true;
    }
  };

  for (const c of config) {
    const data = selectMap[c];
    if (!data) {
      continue;
    }
    if (isArray(data[0])) {
      (data as string[][]).forEach(addSelectForColumn);
    } else {
      addSelectForColumn(data as string[]);
    }
  }

  // handle columns that request select all
  for (const d of selectAllColumns) {
    let selectNode: any = { ...options.select };
    options.select = selectNode;
    for (let i = 0; i < d.length - 1; i++) {
      selectNode = selectNode[d[i]];
    }
    for (const field in selectNode) {
      if (typeof selectNode[field] === "boolean") {
        delete selectNode[field];
      }
    }
  }

  const addSelectAll = (select: any) => {
    let isEmpty = true;
    for (const field in select) {
      isEmpty = false;
      if (isObject(select[field])) {
        select[field] = addSelectAll(select[field]);
      }
    }
    return isEmpty ? true : select;
  };
  options.select = addSelectAll(options.select);
};
