class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class BancoDeDados {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {
		
		let despesas = Array()

		let id = localStorage.getItem('id')
	
		for (let i = 1; i <= id; i++) {
			
			let despesa = JSON.parse(localStorage.getItem(i))
			
			if (despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()

		if (despesa.ano != '' && despesa.ano != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.ano == despesa.ano)
		}
		if (despesa.mes != '' && despesa.mes != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.mes == despesa.mes)
		}
		if (despesa.dia != '' && despesa.dia != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.dia == despesa.dia)
		}
		if (despesa.tipo != '' && despesa.tipo != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.tipo == despesa.tipo)
		}
		if (despesa.descricao != '' && despesa.descricao != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.descricao == despesa.descricao)
		}
		if (despesa.valor != '' && despesa.valor != null) {
			despesasFiltradas = despesasFiltradas.filter(item => item.valor == despesa.valor)
		}
		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bancoDeDados = new BancoDeDados()

function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)

	if (despesa.validarDados()) {
		bancoDeDados.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = bancoDeDados.recuperarTodosRegistros()) {
	if (despesas.length == 0) {
		document.getElementById('modal_titulo').innerHTML = 'Nenhum Registro encontrado'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Nenhum Registro encontrado, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		$('#modalRegistraDespesa').modal('show')
		return
	}

	let listaDespesas = document.getElementById('listaDespesa')
	listaDespesas.innerHTML = ''
	
	despesas.forEach(function (despesa) {

		switch (despesa.tipo) {
			case '1':
				despesa.tipo = 'Alimentação'
				break
			case '2':
				despesa.tipo = 'Educação'
				break
			case '3':
				despesa.tipo = 'Lazer'
				break
			case '4':
				despesa.tipo = 'Saúde'
				break
			case '5':
				despesa.tipo = 'Transporte'
				break
		}

		let linha = listaDespesas.insertRow()
		linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`
		linha.insertCell(1).innerHTML = despesa.tipo
		linha.insertCell(2).innerHTML = despesa.descricao
		linha.insertCell(3).innerHTML = despesa.valor

		let button = document.createElement("button")
		button.className = 'btn btn-danger'
		button.innerHTML = '<i class="fas fa-times"></i>'
		button.id = `id_despesa_${despesa.id}`

		button.onclick = function () {
			let id = this.id.replace('id_despesa_', '')
			document.getElementById('modal_titulo').innerHTML = 'Apagar registro?'
			document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
			document.getElementById('modal_conteudo').innerHTML = `Deseja mesmo excluir o registro selecionado?`

			let btn = document.getElementById('modal_btn')
			btn.innerHTML = 'confirmar'

			document.getElementById('modal_btn').className = 'btn btn-danger'

			$('#modalRegistraDespesa').modal('show')

			btn.onclick = function () {
				bancoDeDados.remover(id)
				window.location.reload()
			}
		}
		linha.insertCell(4).append(button)
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	carregaListaDespesas(bancoDeDados.pesquisar(despesa))
}

