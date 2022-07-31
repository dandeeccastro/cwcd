const rVotoPara = document.querySelector('.esquerda .rotulo.r1 span')
const rCargo = document.querySelector('.esquerda .rotulo.r2 span')
const numeros = document.querySelector('.esquerda .rotulo.r3')
const rDescricao = document.querySelector('.esquerda .rotulo.r4')
const rMensagem = document.querySelector('.esquerda .rotulo.r4 .mensagem')
const rNomeCandidato = document.querySelector('.esquerda .rotulo.r4 .nome-candidato')
const rPartidoPolitico = document.querySelector('.esquerda .rotulo.r4 .partido-politico')
const rNomeVice = document.querySelector('.esquerda .rotulo.r4 .nome-vice')
const rRodape = document.querySelector('.tela .rodape')

const rCandidato = document.querySelector('.direita .candidato')
const rVice = document.querySelector('.direita .candidato.menor')

const votos = []

var etapaAtual = 0
var etapas = null
var numeroDigitado = ''
var votoEmBranco = false

ajax('https://urna-eletronica-cwdc-2022.herokuapp.com/etapas', 'GET', (response) => {
  etapas = JSON.parse(response)
  console.log(etapas)

  comecarEtapa()
})

/** 
 * Função responsável por inicializar o funcionamento de botões, definindo o evento onclick necessário para elas 
 */
window.onload = () => {
  let btns = document.querySelectorAll('.teclado--botao')
  for (let btn of btns) {
    btn.onclick = () => {
      clicar(btn.innerHTML)
    }
  }

  document.querySelector('.teclado--botao.branco').onclick = () => branco()
  document.querySelector('.teclado--botao.laranja').onclick = () => corrigir()
  document.querySelector('.teclado--botao.verde').onclick = () => confirmar()
  document.getElementById('resultados').onclick = () => resultados();
  document.getElementById('restart').onclick = () => restart();
}

/**
 * Inicia a etapa atual.
 */
function comecarEtapa() {
  let etapa = etapas[etapaAtual]
  console.log('Etapa atual: ' + etapa['titulo'])

  numeroDigitado = ''
  votoEmBranco = false

  numeros.style.display = 'flex'
  numeros.innerHTML = ''
  rVotoPara.style.display = 'none'
  rCandidato.style.display = 'none'
  rVice.style.display = 'none'
  rDescricao.style.display = 'none'
  rMensagem.style.display = 'none'
  rNomeCandidato.style.display = 'none'
  rPartidoPolitico.style.display = 'none'
  rNomeVice.style.display = 'none'
  rRodape.style.display = 'none'

  for (let i = 0; i < etapa['numeros']; i++) {
    let pisca = i == 0 ? ' pisca' : ''
    numeros.innerHTML += `
        <div class="numero${pisca}"></div>
        `
  }

  rCargo.innerHTML = etapa['titulo']
}

/**
 * Procura o candidato pelo número digitado,
 * se encontrar, mostra os dados dele na tela.
 */
function atualizarInterface() {
  console.log('Número Digitado:', numeroDigitado)

  let etapa = etapas[etapaAtual]
  let candidato = null

  for (let num in etapa['candidatos']) {
    if (num == numeroDigitado) {
      candidato = etapa['candidatos'][num]
      break
    }
  }

  console.log('Candidato: ' + candidato)

  rVotoPara.style.display = 'inline'
  rDescricao.style.display = 'block'
  rNomeCandidato.style.display = 'block'
  rPartidoPolitico.style.display = 'block'

  if (candidato) {
    let vice = candidato['vice']

    rRodape.style.display = 'block'
    rNomeCandidato.querySelector('span').innerHTML = candidato['nome']
    rPartidoPolitico.querySelector('span').innerHTML = candidato['partido']

    rCandidato.style.display = 'block'
    rCandidato.querySelector('.imagem img').src = `img/${candidato['foto']}`
    rCandidato.querySelector('.cargo p').innerHTML = etapa['titulo']

    if (vice) {
      rNomeVice.style.display = 'block'
      rNomeVice.querySelector('span').innerHTML = vice['nome']
      rVice.style.display = 'block'
      rVice.querySelector('.imagem img').src = `img/${vice['foto']}`
    } else {
      rNomeVice.style.display = 'none'
    }

    return
  }

  if (votoEmBranco) return

  // Anular o voto
  rNomeCandidato.style.display = 'none'
  rPartidoPolitico.style.display = 'none'
  rNomeVice.style.display = 'none'

  rMensagem.style.display = 'block'
  rMensagem.classList.add('pisca')
  rMensagem.innerHTML = 'VOTO NULO'
}

/**
 * Verifica se pode usar o teclado e atualiza o número.
 */
function clicar(value) {
  console.log(value)

  let elNum = document.querySelector('.esquerda .rotulo.r3 .numero.pisca')
  if (elNum && ! votoEmBranco) {
    numeroDigitado += (value)
    elNum.innerHTML = value
    elNum.classList.remove('pisca')

    let proximoNumero = elNum.nextElementSibling
    if (proximoNumero) {
      proximoNumero.classList.add('pisca')
    } else {
      atualizarInterface()
    }

    (new Audio('audio/se1.mp3')).play()
  }
}

/**
 * Verifica se há número digitado, se não,
 * vota em branco.
 */
function branco() {
  console.log('branco')

  // Verifica se há algum número digitado,
  // se sim, não vota
  if (! numeroDigitado) {
    votoEmBranco = true

    numeros.style.display = 'none'
    rVotoPara.style.display = 'inline'
    rDescricao.style.display = 'block'
    rMensagem.style.display = 'block'
    rMensagem.innerHTML = 'VOTO EM BRANCO';

    (new Audio('audio/se1.mp3')).play()
  }

}

/**
 * Reinicia a etapa atual.
 */
function corrigir() {
  console.log('corrigir');
  (new Audio('audio/se2.mp3')).play()
  comecarEtapa()
}

/**
 * Confirma o numero selecionado.
 */
function confirmar() {
  console.log('confirmar')

  let etapa = etapas[etapaAtual]
  console.log(etapa);

  if (numeroDigitado.length == etapa['numeros']) {
    if (etapa['candidatos'][numeroDigitado]) {
      // Votou em candidato
      votos.push({
        'etapa': etapa['titulo'],
        'numero': numeroDigitado
      })
      const req = new Request(`https://urna-eletronica-cwdc-2022.herokuapp.com/vote/${etapa.titulo}`, {
        method: 'POST',
        body: JSON.stringify({
          'code': numeroDigitado,
          'tipo': etapa.titulo,
        })
      });
      fetch(req).then(res => console.log(res))
      console.log(`Votou em ${numeroDigitado}`)
    } else {
      // Votou nulo
      votos.push({
        'etapa': etapa['titulo'],
        'numero': null
      })
      const req = new Request(`https://urna-eletronica-cwdc-2022.herokuapp.com/vote/${etapa.titulo}`, {
        method: 'POST',
        body: JSON.stringify({
          'code': null,
          'tipo': etapa.titulo,
        })
      });
      fetch(req).then(res => console.log(res))
      console.log('Votou Nulo')
    }
  } else if (votoEmBranco) {
    // Votou em branco
    votos.push({
      'etapa': etapa['titulo'],
      'numero': ''
    })
    const req = new Request(`https://urna-eletronica-cwdc-2022.herokuapp.com/vote/${etapa.titulo}`, {
      method: 'POST',
      body: JSON.stringify({
        'code': '',
        'tipo': etapa.titulo,
      })
    });
    fetch(req).then(res => console.log(res))
    console.log('Votou em Branco')
  } else {
    // Voto não pode ser confirmado
    console.log('Voto não pode ser confirmado')
    return
  }

  if (etapas[etapaAtual + 1]) {
    etapaAtual++
  } else {
    document.querySelector('.tela').innerHTML = `
        <div class="fim">FIM</div>
        `
  }

  (new Audio('audio/se3.mp3')).play()
  comecarEtapa()
}

/** Gera a tabela de resultados da eleição */
function resultados() {
  ajax('https://urna-eletronica-cwdc-2022.herokuapp.com/resultados', 'GET', (response) => {
    const resultados = JSON.parse(response);

    const vereadores = resultados.filter((item) => item.tipo == 'vereador').sort((a, b) => a.votos < b.votos);
    const prefeitos = resultados.filter((item) => item.tipo == 'prefeito').sort((a, b) => a.votos < b.votos);

    const vereadorTable = document.getElementById('vereador_table');
    const prefeitoTable = document.getElementById('prefeito_table');

    let vereadorTableHTML = "<table><tbody><tr><th>Nome</th><th>Código</th><th>Partido</th><th>Votos</th></tr>";
    for (const vereador of vereadores)
      vereadorTableHTML += `<tr><td>${vereador.nome}</td><td>${vereador.codigo}</td><td>${vereador.partido}</td><td>${vereador.votos}</td></tr>`
    vereadorTableHTML += "</tbody></table>";
    vereadorTable.innerHTML = vereadorTableHTML;

    let prefeitoTableHTML = "<table><tbody><tr><th>Nome</th><th>Código</th><th>Partido</th><th>Vice</th><th>Partido do Vice</th><th>Votos</th></tr>";
    for (const prefeito of prefeitos)
      prefeitoTableHTML += `<tr><td>${prefeito.nome}</td><td>${prefeito.codigo}</td><td>${prefeito.partido || 'XXX'}</td><td>${prefeito.vice_nome || 'XXX'}</td><td>${prefeito.vice_partido || 'XXX'}</td><td>${prefeito.votos}</td></tr>`
    prefeitoTableHTML += "</tbody></table>";
    prefeitoTable.innerHTML = prefeitoTableHTML;
  })
}

/** Reinicia a eleição, zerando os votos no banco de dados */
function restart() {
  const req = new Request("https://urna-eletronica-cwdc-2022.herokuapp.com/reset", { method: 'POST' });
  fetch(req).then((response) => console.log(response));
}
