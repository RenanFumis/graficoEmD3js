
  onload = () =>{
    let dados = [
      {chave: 'Samurai X', valor: 94},
      {chave:'Yu Yu Hakusho', valor: 112},
      {chave: 'Pokémon', valor: 1272},
      {chave: 'Afro Samurai', valor: 5},
      {chave: 'One Piece', valor: 1071},
      {chave: 'Medabots', valor: 52},
      {chave: 'Fullmetal Alchemist', valor: 51},
      {chave: 'Dragon Ball', valor: 291},
    ];
    
    let graf = new Grafico({
      seletor: '#grafico',
      dados: dados,
      largura: 700,
      altura: 400,
      tituloX: 'Animes',
      tituloY: 'Número de Episódios'
    })

    //criando botão que interage
    let ordemCrescente = true
    let ordemDecrescente = true

    btn.onclick = () => {
      if (ordemCrescente){
        dados.sort((a, b) => a.valor - b.valor)
      }else if (ordemDecrescente){
        dados.sort((a, b) => b.valor - a.valor)
      }
      ordemCrescente = !ordemCrescente; // Alterna a o estado atual da ordem
      graf.atualize(dados)
    }

    aleatorio.onclick = () => {
      dados.sort(() => Math.random() -0.5)

      ordemCrescente = !ordemCrescente;
      graf.atualize(dados)
    }
    
  }

    function Grafico(parametros){
    let svg = d3.select(parametros.seletor)
    .attr('width', parametros.largura + 'px')
    .attr('height', parametros.altura + 'px')

    let margens = {
      esquerda: 80,
      direita: 20,
      superior: 40,
      inferior: 40
    }

    this.larguraPlotagem = parametros.largura - margens.esquerda - margens.direita;
    this.alturaPlotagem = parametros.altura - margens.superior - margens.inferior;

    this.plotagem = svg.append('g')
      .attr('width', this.larguraPlotagem)
      .attr('height', this.alturaPlotagem)
      .attr('transform', 'translate(' + margens.esquerda +',' + margens.inferior+')')

// Responsável pela barra do grafico
  this.fnX = d3.scaleBand()
      .domain(parametros.dados.map((d) => d.chave))
      .range([0, this.larguraPlotagem])
      .padding(0.1)

      this.fnY = d3.scaleLinear()
      .domain([0, d3.max(parametros.dados.map((d) => d.valor))])
      .range([this.alturaPlotagem, 0])

 //Cor das barras
      this.fnCores = d3.scaleLinear()
            .domain([0, d3.max(parametros.dados.map(d => d.valor))])
            .range(d3.schemeTableau10)

//Criando eixos de infos
      this.eixoX = d3.axisBottom(this.fnX)
      this.plotagem.append('g')
      .attr('id', 'eixoX')
      .attr('transform', 'translate(0,' + this.alturaPlotagem +')')
      .call(this.eixoX)

      this.eixoY = d3.axisLeft(this.fnY)
      .tickFormat(d => d.toLocaleString('en-US').replace(',', '.')) //troquei a virgula por ponto
      this.plotagem.append('g')
      .attr('id', 'eixoY')
      .call(this.eixoY)

      this.grade = d3.axisRight(this.fnY)
      .tickSize(this.larguraPlotagem)
      .tickFormat('')
      this.plotagem.append('g')
      .attr('class', 'grade')
      .call(this.grade)

//fim do desenho do grafico
    svg.append('text')
    .attr('x', margens.esquerda)
    .attr('y', margens.superior + this.alturaPlotagem)
    .attr('id', 'tituloX')
    .attr('transform', 'translate(' + this.larguraPlotagem / 2 + ', 150)')
    .text(parametros.tituloX)


    svg.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('id', 'tituloY')
    .attr('transform', 'translate(20, ' + (margens.superior + this.alturaPlotagem /2) + ') rotate(-90)')
    .text(parametros.tituloY)

//Tratando as atualizações de dados
  this.atualize = (novosDados) => {

    this.fnX.domain(novosDados.map((d) => d.chave))
    this.fnY.domain([0, d3.max(novosDados.map((d) => d.valor))])
    this.fnCores.domain([0, d3.max(novosDados.map(d => d.valor))])

//interações com o grafico
    this.plotagem.select('#eixoX').transition().duration(this.duration).call(this.eixoX)
    this.plotagem.select('#eixoY').transition().duration(this.duration).call(this.eixoY)
    this.plotagem.select('#grade').transition().duration(this.duration).call(this.grade)

  let self = this

    let retangulos = this.plotagem.selectAll('.barra').data(novosDados)
    retangulos.enter().append('rect').classed('barra', true)
    .on('mouseover', function(){
      d3.select(this).style('fill-opacity', '0.5')
    })
    .on('mouseout', function(){
      d3.select(this).style('fill-opacity', '1')
    })
    retangulos.exit().remove()

//desenho das Barras
      this.plotagem
      .selectAll('.barra').transition().duration(this.duration)
      .attr('x', (d) => this.fnX(d.chave))
      .attr('y', (d) => this.fnY (d.valor))
      .attr('width', this.fnX.bandwidth())
      .attr('height', (d) => this.alturaPlotagem - this.fnY(d.valor))
      .attr('fill', (d,i)=> this.fnCores(d.valor))



    let rotulos = this.plotagem.selectAll('.rotulo').data(novosDados)
    rotulos.enter().append('text').classed('rotulo', true)
    rotulos.exit().remove()
//Desenho dos Rótulos
    this.plotagem
    .selectAll('.rotulo').transition().duration(this.duration)
    .text((d) => d.valor)
    .attr('dx', this.fnX.bandwidth() * 0.6)
    .attr('dy',  -7 )
    .attr('x', (d) => this.fnX(d.chave))
    .attr('y', (d) => this.fnY(d.valor))
    
    this.duration = 500
    }

    this.atualize(parametros.dados)

}
