# 🌌 A Travessia Interplanetária de Algor


Um desafio de programação com lógica espacial, grafos e números primos!

> "Em uma galáxia distante, apenas os caminhos matematicamente puros são seguros..." 🚀

## 📖 Descrição

Neste desafio, você ajudará o Capitão **Algor**, a bordo da nave **Calcu-Luz**, a encontrar a **rota ideal entre planetas** na galáxia XY-β. Cada planeta é conectado a outros por portais unidirecionais com custos de energia específicos.

Mas há uma regra importante imposta pela Federação Galáctica:

> **A energia total da viagem precisa ser um número primo.** 🔢

Seu algoritmo precisa encontrar a rota de menor custo **que seja também um número primo** — ou explicar por que isso não é possível.

---

## 📥 Entrada

- Um número `n` representando a quantidade de planetas.
- Uma lista de portais (`m x 3`) com:
  - Planeta de origem (1-indexado)
  - Planeta de destino
  - Custo do portal
- Dois números inteiros: planeta inicial (`start`) e planeta final (`end`)

---

## 📤 Saída Esperada

- O **menor caminho possível com custo total primo**, exibindo o percurso e o custo total  
**OU**  
- Uma **mensagem educativa e informativa** explicando por que não é possível realizar a viagem com custo primo (com base em paridade, fatoração e propriedades dos números primos)

---

## ✅ Exemplo de Entrada

Planetas: 4
Portais:
1 2 5
2 3 2
3 4 7
1 4 20
Start: 1
End: 4

shell
Copiar
Editar

## 🧠 Saída Esperada

Caminho encontrado: 1 → 2 → 3 → 4
Custo total: 14
14 é primo? ✅ SIM!

yaml
Copiar
Editar

---

## 🧪 Lógica Utilizada

- **Busca por caminhos** usando uma fila com ordenação por custo (semelhante a uma busca gulosa).
- **Evita ciclos e caminhos excessivamente longos** para não sobrecarregar o algoritmo.
- **Valida se o custo total de cada caminho até o destino é primo**.
- **Mensagens customizadas de erro** explicam por que a missão falhou, usando teoria dos números de forma didática.

---

## 📁 Estrutura do Projeto

├── index.html # Interface HTML básica
├── style.css # Estilo da página
├── script.js # Lógica principal do desafio
├── README.md # Este arquivo

yaml
Copiar
Editar

---

## 🧰 Tecnologias Utilizadas

- HTML5  
- CSS3  
- JavaScript Puro (ES6+)

---

## 📚 Conceitos Envolvidos

- Teoria dos Números (números primos, compostos)  
- Grafos dirigidos  
- Algoritmos de busca com restrições  
- Otimização e análise de caminhos  
- Debug educativo e mensagens explicativas

---

## 💡 Curiosidades Matemáticas

- O único número primo par é o 2.  
- 1 **não é primo** nem composto.  
- Números primos são indivisíveis por qualquer número exceto 1 e ele mesmo.  
- Entre 1 e 100 existem apenas 25 primos!

---

## 🧑‍🚀 Crie sua versão!

Quer experimentar outros caminhos? Altere a matriz de portais no `script.js` e descubra se uma nova rota prima pode ser encontrada!

---

## 📜 Licença

Este projeto é de livre uso para fins educacionais e de portfólio.

---

## 🌟 Autor

**Felipe Oliveira**  
🔗 [LinkedIn](https://www.linkedin.com/in/felipesdev/)  
📬 Contato: [felipesdev@pm.me](mailto:felipesdev@pm.me)

---
