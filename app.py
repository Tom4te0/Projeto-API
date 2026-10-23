
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)   # Cria a aplicação Flask
alunos = []     # Guarda os cadastros na memoria
proximo_id = 1  # Controla os IDs dos alunos

@app.get("/")   # GET o navegador pede a página inicial
def inicio():
    return render_template("index.html")

@app.post('/api/alunos')    # POST: recebe os dados enviados pelo JavaScript
def cadastrar_aluno():
    global proximo_id

    dados = request.get_json(silent=True) # Converte o JSON em dados Python
    if not isinstance(dados, dict): # Recusa JSON invalido
        return jsonify(mensagem="Envie um objeto JSON válido"), 400

    nome = dados.get("nome")    # Procura o campo nome no dicionario
    if not isinstance(nome, str) or not nome.strip():
        return jsonify(mensagem="Preencha o nome do aluno"), 400

    email = dados.get("email")
    if not isinstance(email, str) or not email.strip():
        return jsonify(mensagem="Preencha o e-mail do aluno"), 400

    curso = dados.get("curso")
    if not isinstance(curso, str) or not curso.strip():
        return jsonify(mensagem="Selecione um curso"), 400

    aluno = {
        'id': proximo_id,
        'nome': nome.strip(),
        'email': email.strip(),
        'curso': curso.strip()
    }

    alunos.append(aluno)    # Adiciona a lista o aluno (não existe bd)
    proximo_id += 1

    return jsonify(
        mensagem=f'aluno {aluno["nome"]} cadastrado!',
        aluno=aluno,
        id=aluno["id"]
    ), 201


@app.delete('/api/alunos/<int:aluno_id>')
def excluir_aluno(aluno_id):
    for aluno in alunos:
        if aluno["id"] == aluno_id:
            alunos.remove(aluno)
            return jsonify(
                mensagem="Aluno excluído com sucesso!",
                id=aluno_id
            ), 200

    return jsonify(mensagem="Aluno não encontrado"), 404


if __name__ == "__main__":  # Executa apenas ao rodar este arquivo diretamente
    app.run() # Servidor local para demonstração
