import { Cell, Workbook } from "exceljs";
import { cloneDeep, get, omit } from "lodash";
import stringWidth from "string-width";

type DataIndex = string | number | symbol | Array<string | number | symbol>;

type RenderFunction<T> = (value: any, record: T, index: number) => any;

type HeaderCell = { title: string; start: number; span: { col: number; row: number }; note?: string };

type SingleColumn<T = any> = {
  key: number;
  title: string;
  note?: string;
  width?: number;
  dataIndex?: DataIndex;
  isArray?: boolean;
  render?: RenderFunction<T>;
};

type GroupColumn<T = any> = {
  key: number;
  title: string;
  note?: string;
  children: Column<T>[];
};

export type Column<T = any> = SingleColumn<T> | GroupColumn<T>;

export type Sheet<T = any> = {
  name: string;
  columns: Column<T>[];
  dataSource: T[];
};

export const filterColumns = <T = any>(columns: Array<Column<T>>, config: number[]) => {
  return columns
    .filter((column) => "children" in column || config.includes(column.key))
    .map((_column): Column<T> => {
      const column = cloneDeep(_column);
      if ("children" in column) {
        column.children = filterColumns(column.children, config);
      }
      return column;
    })
    .filter((column) => !("children" in column) || column.children.length);
};

const headerFormat = (cell: Cell) => {
  cell.font = { bold: true, name: "Noto Sans JP" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } };
  cell.alignment = { horizontal: "center", vertical: "middle" };
};

const rowFormat = (cell: Cell) => {
  const value = cell.value;
  const isHyperlink = value && typeof value === "object" && "hyperlink" in value;

  cell.font = isHyperlink
    ? { name: "Noto Sans JP", color: { argb: "FF0000FF" }, underline: true }
    : { name: "Noto Sans JP" };
  cell.alignment = { vertical: "middle" };
};

export const toWorkbook = async <T = any>(sheets: Sheet<T>[]) => {
  const workbook = new Workbook();
  for (const { name, columns, dataSource } of sheets) {
    const worksheet = workbook.addWorksheet(name);
    const header: HeaderCell[][] = [];
    const columnMap: Array<SingleColumn<T>> = [];

    let headerRowCnt = 1;
    const countHeaderRows = (columns: Column[], cnt = 1) => {
      columns.forEach((column) => {
        if ("children" in column) {
          countHeaderRows(column.children, cnt + 1);
        }
      });
      headerRowCnt = Math.max(headerRowCnt, cnt);
    };
    countHeaderRows(columns);

    const extractColumns = (columns: Column[], level = 0, start = 0) => {
      let cnt = 0;
      while (header.length <= level) {
        header.push([]);
      }
      columns.forEach((column) => {
        const cell: HeaderCell = {
          title: column.title,
          start: start + cnt,
          span: { col: 1, row: headerRowCnt - level },
          note: column.note,
        };
        if ("children" in column) {
          const childCnt = extractColumns(column.children, level + 1, start + cnt);
          cell.span.row = 1;
          cell.span.col = childCnt;
          cnt += childCnt;
        } else {
          columnMap.push(omit(column));
          cnt += 1;
        }
        header[level].push(cell);
      });
      return cnt;
    };
    extractColumns(columns);

    // Add header rows
    header.forEach((row) => {
      const data: string[] = [];
      row
        .slice()
        .sort((a, b) => a.start - b.start)
        .forEach(({ start, title, span: { col } }) => {
          while (data.length < start) {
            data.push("");
          }
          data.push(title, ...Array(col - 1).fill(""));
        });
      const addedRow = worksheet.addRow(data);
      addedRow.eachCell(headerFormat);
      row.forEach(({ start, note }) => {
        if (note) {
          addedRow.getCell(start + 1).note = note;
        }
      });
    });

    // Merge header cells
    header.forEach((row, i) => {
      row.forEach(({ start, span: { col, row } }) => {
        worksheet.mergeCells(i + 1, start + 1, i + row, start + col);
      });
    });

    // Add data rows
    const hasArray = columnMap.some((e) => e.isArray);
    dataSource.forEach((record, index) => {
      const rowData = columnMap.map(({ dataIndex, render }) => {
        let value: string | undefined;
        if (dataIndex) {
          value = get(record, dataIndex);
        }
        if (render) {
          value = render(value, record, index);
        }
        return value ?? "";
      });
      if (hasArray) {
        const rowCnt = Math.max(...columnMap.map((e, i) => (e.isArray ? rowData[i]?.length : 1)));
        const rows = Array(rowCnt)
          .fill(0)
          .map((_, r) => {
            const row = worksheet.addRow(rowData.map((e, i) => (columnMap[i].isArray ? (e?.[r] ?? "") : e)));
            row.eachCell(rowFormat);
            return row;
          });
        const lastRow = rows.at(-1)!.getCell(1).fullAddress.row;
        columnMap.forEach((e, i) => {
          if (!e.isArray) {
            worksheet.mergeCells(lastRow - rowCnt + 1, i + 1, lastRow, i + 1);
          }
        });
      } else {
        worksheet.addRow(rowData).eachCell(rowFormat);
      }
    });

    // Auto width for columns
    worksheet.columns.forEach((column, i) => {
      if (columnMap[i].width !== undefined) {
        column.width = columnMap[i].width;
        column.eachCell?.((cell) => {
          cell.alignment.wrapText = true;
        });
      } else {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const length = stringWidth(cell.value?.toString() || "");
          if (length > maxLength) maxLength = length;
        });
        column.width = maxLength * 1.1 + 2;
      }
    });

    worksheet.eachRow((row) => {
      let maxHeight = 15;
      row.eachCell?.((cell) => {
        const lines = cell.value?.toString().split("\n").length ?? 1;
        const tempHeight = maxHeight * lines;
        if (tempHeight > maxHeight) maxHeight = tempHeight;
      });
      row.height = maxHeight * 1.1; // 1.1 for little padding thing
    });
  }

  return workbook;
};

export const toCsv = async <T = any>(columns: Column<T>[], dataSource: T[]) => {
  const workbook = await toWorkbook([{ name: "csv", columns, dataSource }]);

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string" && /^\d{4}[-/]\d{2}[-/]\d{2}$/.test(cell.value)) {
          cell.value = `\t${cell.value}`;
        }
      });
    });
  });

  const buffer = await workbook.csv.writeBuffer();

  return Buffer.concat([Buffer.from("\ufeff", "utf8"), Buffer.from(buffer)]);
};

export const toExcel = async <T = any>(sheets: Sheet<T>[]) => {
  const workbook = await toWorkbook(sheets);

  return await workbook.xlsx.writeBuffer();
};
