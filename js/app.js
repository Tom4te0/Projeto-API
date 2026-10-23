
const formulario = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("botao");

if (formulario && mensagem && botao) {
  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const curso = document.getElementById("curso").value;

    if (!nome.trim() || !email.trim() || !curso.trim()) {
      mensagem.textContent = "Preencha todos os campos.";
      return;
    }

    botao.disabled = true;
    mensagem.textContent = "Enviando...";

    try {
      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          curso: curso
        })
      });

      const dados = await resposta.json();

      mensagem.textContent = resposta.ok
        ? `${dados.mensagem} ID: ${dados.id}`
        : dados.mensagem;

      if (resposta.ok) {
        formulario.reset();
      }
    } catch (erro) {
      console.error(erro);
      mensagem.textContent =
        "Erro de comunicação com o servidor.";
    } finally {
      botao.disabled = false;
    }
  });
}

const formularioExclusao =
  document.getElementById("formularioExclusao");

const mensagemExclusao =
  document.getElementById("mensagemExclusao");

const botaoExcluir =
  document.getElementById("botaoExcluir");

if (formularioExclusao && mensagemExclusao && botaoExcluir) {
  formularioExclusao.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const valorId = document.getElementById("idAluno").value;
    const id = Number(valorId);

    if (!valorId || !Number.isInteger(id) || id <= 0) {
      mensagemExclusao.textContent =
        "Informe um ID inteiro positivo.";
      return;
    }

    if (!confirm(`Deseja excluir o aluno de ID ${id}?`)) {
      return;
    }

    botaoExcluir.disabled = true;

    try {
      const resposta = await fetch(`/api/alunos/${id}`, {
        method: "DELETE"
      });

      const dados = await resposta.json();
      mensagemExclusao.textContent = dados.mensagem;

      if (resposta.ok) {
        formularioExclusao.reset();
      }
    } catch (erro) {
      console.error(erro);
      mensagemExclusao.textContent =
        "Erro de comunicação com o servidor.";
    } finally {
      botaoExcluir.disabled = false;
    }
  });
}
