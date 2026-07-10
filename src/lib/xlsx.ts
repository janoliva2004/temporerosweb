import type ExcelJSNS from "exceljs";

/**
 * Utilidades compartidas para escribir en el Excel local (modo localhost).
 * Usado por `submit-order.ts` (hoja "Input Form Web") y `didit.ts` (hoja
 * "Validacion Didit"). Serializa todas las escrituras para que dos peticiones
 * simultáneas no corrompan el archivo.
 *
 * El .xlsx debe estar CERRADO en Excel al escribir, o Windows bloquea (EBUSY).
 */

type Workbook = ExcelJSNS.Workbook;
type Worksheet = ExcelJSNS.Worksheet;

const DEFAULT_EXCEL_PATH = "C:\\Users\\janol\\Downloads\\Orderflow temporeros.xlsx";

export function excelPath(): string {
  return process.env.EXCEL_PATH || DEFAULT_EXCEL_PATH;
}

// Cola de escrituras: cada mutación espera a la anterior.
let chain: Promise<unknown> = Promise.resolve();

/**
 * Abre el libro, ejecuta `fn` (que modifica una o varias hojas) y lo guarda,
 * todo serializado respecto a otras llamadas a mutateWorkbook.
 */
export function mutateWorkbook<T>(fn: (wb: Workbook) => T | Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    // Import dinámico: exceljs solo se carga en el servidor, nunca en el navegador.
    const ExcelJS = (await import("exceljs")).default;
    const filePath = excelPath();
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const result = await fn(wb);
    await wb.xlsx.writeFile(filePath);
    return result;
  });
  // Evita que un fallo rompa la cadena para las siguientes peticiones.
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run as Promise<T>;
}

/** Primera fila libre (a partir de la 2) según una columna clave vacía. */
export function firstFreeRow(ws: Worksheet, keyCol: number): number {
  const maxRow = ws.rowCount;
  for (let r = 2; r <= maxRow + 1; r++) {
    const v = ws.getRow(r).getCell(keyCol).value;
    if (v === null || v === undefined || String(v).trim() === "") return r;
  }
  return maxRow + 1;
}

/** Escribe un array de valores en las columnas A, B, C… de la fila indicada. */
export function writeRowValues(
  ws: Worksheet,
  rowNum: number,
  values: (string | number)[],
): void {
  const row = ws.getRow(rowNum);
  values.forEach((v, i) => {
    row.getCell(i + 1).value = v === "" ? null : v;
  });
  row.commit();
}

/** Mensaje de error legible (detecta el archivo bloqueado por Excel abierto). */
export function friendlyExcelError(err: unknown): string {
  if (err instanceof Error && /EBUSY|EPERM|resource busy|locked/i.test(err.message)) {
    return "El Excel está abierto. Ciérralo en Excel e inténtalo de nuevo.";
  }
  return err instanceof Error ? err.message : "No se pudo escribir en el Excel.";
}
