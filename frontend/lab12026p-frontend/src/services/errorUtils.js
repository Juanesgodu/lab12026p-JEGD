// Convierte cualquier error de Axios en un mensaje de texto legible
// para mostrarlo directamente en la interfaz.
//
// El backend devuelve los errores de dos formas distintas:
//  - En /api/transactions, el controller responde con
//    ResponseEntity.badRequest().body(e.getMessage()), es decir,
//    el cuerpo es directamente un texto plano (String).
//  - En otros endpoints (por ejemplo, errores no controlados),
//    Spring Boot devuelve el JSON por defecto:
//    { timestamp, status, error, message, path }.
export function extractErrorMessage(error, fallback = 'Ocurrió un error inesperado.') {
  if (!error) return fallback;

  // El backend respondió, pero con un código de error (4xx/5xx)
  if (error.response) {
    const data = error.response.data;

    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }

    if (data && typeof data === 'object' && typeof data.message === 'string') {
      return data.message;
    }

    return `Error del servidor (código ${error.response.status}).`;
  }

  // La petición se envió pero no hubo respuesta (backend apagado, red, CORS, etc.)
  if (error.request) {
    return 'No se pudo conectar con el backend. Verifica que el servidor Spring Boot esté corriendo en http://localhost:8080.';
  }

  // Error antes de siquiera enviar la petición
  return error.message || fallback;
}
