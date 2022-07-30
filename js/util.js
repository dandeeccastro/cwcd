/**
 * Função genérica para realizar requisições
 * @param {string} url - URL da requisição 
 * @param {string} method - Método da requisição
 * @param {function} callback - Função a ser chamada no retorno da requisição
 * @param {string} body - Parâmetros do corpo da requisição
 */
function ajax(url, method, callback, body = null) {
  let request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open(method, url, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status == "200") {
        callback(request.responseText);
    }
  };
  request.send(body);
}
