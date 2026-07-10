/**
 * Pasarela Web -> Google Sheet (hojas "Input Form Web" y "Validacion Didit")
 * -------------------------------------------------------------------------
 * Instalación:
 *  1. Abre el Google Sheet -> Extensiones -> Apps Script.
 *  2. Borra todo y pega este archivo. Guarda.
 *  3. Cambia SECRET_TOKEN por una cadena aleatoria larga (la misma en la web).
 *  4. Implementar -> Nueva implementación -> Tipo "Aplicación web":
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquier usuario
 *     Copia la URL que acaba en "/exec": esa es SHEETS_WEBHOOK_URL.
 *
 *  IMPORTANTE: si cambias este código, crea una NUEVA versión de la
 *  implementación (Gestionar implementaciones -> editar ✏️ -> Nueva versión)
 *  para que aplique. Si no, sigue corriendo la versión antigua.
 *
 * Acciones (campo "action" del POST):
 *   - "order"      -> añade fila en Input Form Web (compra). Devuelve la fila.
 *   - "pago"       -> Fecha Pago en Input Form Web + ID Stripe en Validacion Didit.
 *   - "validacion" -> resultado Didit en Validacion Didit (dedupe por fila formulario).
 *
 * Las escrituras NO sobrescriben celdas con valor vacío: así el pago (col A)
 * y la validación Didit (cols B..G) pueden rellenar la misma fila por separado.
 */

// Debe coincidir con SHEETS_WEBHOOK_SECRET en la web.
var SECRET_TOKEN = "CAMBIA_ESTO_por_una_cadena_larga_aleatoria";

var INPUT_SHEET = "Input Form Web";        // columnas A..N
var VALIDACION_SHEET = "Validacion Didit"; // columnas A..J (J = Fila formulario)

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: "Sin cuerpo en la petición" });
    }
    var data = JSON.parse(e.postData.contents);
    if (String(data.secret || "") !== SECRET_TOKEN) {
      return json_({ ok: false, error: "Token no válido" });
    }

    if (data.action === "order") {
      // Dedupe por Order ID (col B): reintentos de /pago-ok no crean fila doble.
      var orderRow = writeRow_(INPUT_SHEET, data.values, 2, 2, data.orderId);
      return json_({ ok: true, row: orderRow });
    }

    if (data.action === "contacto") {
      MailApp.sendEmail({
        to: "jan@connectivityglobal.com",
        subject: "Nuevo mensaje de contacto — web Connectivity",
        replyTo: data.email || "",
        body:
          "Nombre: " + (data.name || "") + "\n" +
          "Email: " + (data.email || "") + "\n\n" +
          "Mensaje:\n" + (data.message || ""),
      });
      return json_({ ok: true });
    }

    if (data.action === "pago") {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      // Fecha Pago -> Input Form Web, columna G (7), en la fila del formulario.
      if (data.formRow && data.fechaPago) {
        var inSheet = ss.getSheetByName(INPUT_SHEET);
        if (inSheet) inSheet.getRange(Number(data.formRow), 7).setValue(data.fechaPago);
      }
      // ID Stripe -> Validacion Didit, columna A, por dedupe de "Fila formulario" (J=10).
      var vals = [data.stripeId || "", "", "", "", "", "", "", "", "", data.formRow];
      var pRow = writeRow_(VALIDACION_SHEET, vals, 2, 10, data.formRow);
      return json_({ ok: true, row: pRow });
    }

    if (data.action === "validacion") {
      var vRow = writeRow_(VALIDACION_SHEET, data.values, 2, 10, data.formRow);
      return json_({ ok: true, row: vRow });
    }

    return json_({ ok: false, error: "action desconocida: " + data.action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Comprobación rápida de que la implementación está viva.
function doGet() {
  return json_({ ok: true, status: "alive" });
}

/**
 * Escribe `values` (array A,B,C…) en una hoja, SIN sobrescribir con celdas vacías.
 *  - keyCol: columna "clave" para buscar la primera fila libre.
 *  - dedupeCol / dedupeVal: si se pasan, actualiza la fila con ese valor en vez de crear.
 * Devuelve el número de fila escrita.
 */
function writeRow_(sheetName, values, keyCol, dedupeCol, dedupeVal) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('No existe la hoja "' + sheetName + '"');

  var lastRow = sheet.getLastRow();
  var target = 0;

  // 1) Dedupe: busca fila existente con dedupeVal en dedupeCol.
  if (dedupeCol && dedupeVal !== undefined && dedupeVal !== null && lastRow >= 2) {
    var colVals = sheet.getRange(2, dedupeCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < colVals.length; i++) {
      if (String(colVals[i][0]) === String(dedupeVal)) {
        target = i + 2;
        break;
      }
    }
  }

  // 2) Primera fila libre según la columna clave.
  if (!target) {
    target = 2;
    if (lastRow >= 2) {
      var keyVals = sheet.getRange(2, keyCol, lastRow - 1, 1).getValues();
      target = lastRow + 1;
      for (var j = 0; j < keyVals.length; j++) {
        var v = keyVals[j][0];
        if (v === "" || v === null) {
          target = j + 2;
          break;
        }
      }
    }
  }

  // Escribe celda a celda; salta las vacías para no borrar lo ya escrito.
  for (var c = 0; c < values.length; c++) {
    var val = values[c];
    if (val !== "" && val !== null && val !== undefined) {
      sheet.getRange(target, c + 1).setValue(val);
    }
  }
  return target;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
