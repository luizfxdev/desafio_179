document.addEventListener('DOMContentLoaded', function () {
  const calculateBtn = document.getElementById('calculate')
  const resetBtn = document.getElementById('reset')
  const resultDiv = document.getElementById('result')

  calculateBtn.addEventListener('click', function () {
    try {
      // Obter valores dos inputs
      const numPlanets = parseInt(document.getElementById('planets').value)
      const portalsInput = document.getElementById('portals').value.trim()
      const start = parseInt(document.getElementById('start').value)
      const end = parseInt(document.getElementById('end').value)

      // Validar inputs básicos
      if (isNaN(numPlanets) || numPlanets < 2) {
        throw new Error('Número de planetas inválido. Deve ser ≥ 2')
      }

      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > numPlanets || end > numPlanets) {
        throw new Error(`Planetas de início/destino devem estar entre 1 e ${numPlanets}`)
      }

      if (start === end) {
        throw new Error('Planeta de início e destino devem ser diferentes')
      }

      // Processar portais
      const portals = []
      const lines = portalsInput.split('\n').filter(line => line.trim() !== '')

      if (lines.length === 0) {
        throw new Error('É necessário informar pelo menos um portal')
      }

      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length !== 3) {
          throw new Error(`Formato inválido: "${line}". Use: origem destino custo`)
        }

        const from = parseInt(parts[0])
        const to = parseInt(parts[1])
        const cost = parseInt(parts[2])

        if (
          isNaN(from) ||
          isNaN(to) ||
          isNaN(cost) ||
          from < 1 ||
          to < 1 ||
          from > numPlanets ||
          to > numPlanets ||
          cost <= 0
        ) {
          throw new Error(`Portal inválido: "${line}". Planetas devem ser 1-${numPlanets} e custo > 0`)
        }

        portals.push({ from, to, cost })
      }

      // Encontrar o caminho com menor energia prima
      const result = findOptimalPrimePath(numPlanets, portals, start, end)

      if (result.success) {
        resultDiv.innerHTML = `
          <p>A menor quantidade de energia é <span class="highlight">${
            result.minPrimeCost
          }</span>; número primo encontrado! 🌌</p>
          <p class="path">Caminho: ${result.optimalPath.join(' → ')}</p>
          <p class="details">Detalhes:</p>
          <ul>
            <li>Total de energia: ${result.minPrimeCost}</li>
            <li>Número de saltos: ${result.optimalPath.length - 1}</li>
            <li>Portais utilizados: ${result.pathDetails.join(', ')}</li>
          </ul>
          ${
            result.debugInfo
              ? `<p class="debug"><strong>Debug - Todos os caminhos encontrados:</strong><br>${result.debugInfo}</p>`
              : ''
          }
        `
        // Adicionar estilos CSS dinamicamente para debug e exemplos
        if (!document.getElementById('debug-styles')) {
          const style = document.createElement('style')
          style.id = 'debug-styles'
          style.textContent = `
              .debug {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 5px;
                font-size: 0.9rem;
              }
              .highlight {
                color: #ffd700;
                font-weight: bold;
                font-size: 1.2em;
              }
              .path {
                color: #87ceeb;
                font-weight: bold;
                margin: 0.5rem 0;
              }
              .details {
                color: #ddd;
                margin: 0.5rem 0;
              }
              .error {
                color: #ff6b6b;
              }
              .explanation {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid rgba(255, 107, 107, 0.3);
                border-radius: 5px;
              }
              .explanation h4 {
                color: #ffcccb;
                margin-bottom: 0.5rem;
              }
              .explanation p {
                color: #ddd;
                line-height: 1.5;
              }
              .examples-math {
                margin: 1rem 0;
                padding: 0.8rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                border-left: 3px solid #ffa500;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
              }
              .tip {
                margin-top: 1rem;
                padding: 0.8rem;
                background: rgba(145, 255, 0, 0.1);
                border: 1px solid rgba(187, 255, 0, 0.3);
                border-radius: 4px;
                color: #b8f2d1;
              }
              .examples-section {
                margin: 1.5rem 0;
                padding: 1rem;
                background: rgba(166, 255, 0, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(200, 255, 0, 0.2);
              }
              .examples-section h3 {
                color: #ffd700;
                margin-bottom: 1rem;
                font-size: 1.1rem;
              }
              .example-buttons {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
              }
              .example-btn {
                position: relative;
                background: #444;
                color: #fff;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: 0.2s;
                flex: 1;
                min-width: 200px;
              }
              .example-btn:hover {
                background: var(--clr);
                color: var(--clr);
                transform: translateY(-2px);
              }
              .example-btn::before {
                content: '';
                position: absolute;
                inset: 2px;
                background: #272822;
                border-radius: 3px;
                z-index: 0;
              }
              .example-btn span {
                position: relative;
                z-index: 1;
              }
              @media (max-width: 768px) {
                .example-buttons {
                  flex-direction: column;
                }
                .example-btn {
                  min-width: auto;
                }
              }
            `
          document.head.appendChild(style)
        }
      } else {
        // Gerar mensagem de erro variada e educativa
        const errorMessage = generateErrorMessage(result.debugInfo)
        resultDiv.innerHTML = `
          <p class="error">${errorMessage.title}</p>
          ${
            result.debugInfo
              ? `<p class="debug"><strong>Debug - Caminhos testados:</strong><br>${result.debugInfo}</p>`
              : ''
          }
          <div class="explanation">
            <h4>${errorMessage.icon} ${errorMessage.heading}</h4>
            <p>${errorMessage.explanation}</p>
            ${errorMessage.examples ? `<div class="examples-math">${errorMessage.examples}</div>` : ''}
            ${errorMessage.tip ? `<div class="tip">💡 <strong>Dica:</strong> ${errorMessage.tip}</div>` : ''}
          </div>
        `
      }
    } catch (error) {
      resultDiv.innerHTML = `<p class="error">Erro: ${error.message}</p>`
    }
  })

  resetBtn.addEventListener('click', function () {
    document.getElementById('planets').value = ''
    document.getElementById('portals').value = ''
    document.getElementById('start').value = ''
    document.getElementById('end').value = ''
    resultDiv.innerHTML = ''
  })

  // Event listeners para os exemplos
  document.getElementById('load-example-non-prime').addEventListener('click', function () {
    // Exemplo do desafio original que NÃO tem solução prima (33 não é primo)
    document.getElementById('planets').value = '5'
    document.getElementById('portals').value = `1 2 10
2 3 15
3 4 5
4 5 3
1 5 40`
    document.getElementById('start').value = '1'
    document.getElementById('end').value = '5'
    resultDiv.innerHTML =
      '<p style="color: #ff9500;">📝 Exemplo carregado! Este é o exemplo original do desafio que demonstra que 33 NÃO é primo.</p>'
  })

  document.getElementById('load-example-with-prime').addEventListener('click', function () {
    // Exemplo que TEM solução prima
    document.getElementById('planets').value = '4'
    document.getElementById('portals').value = `1 2 2
2 3 3
3 4 2
1 4 11`
    document.getElementById('start').value = '1'
    document.getElementById('end').value = '4'
    resultDiv.innerHTML =
      '<p style="color: #ffd700;">✅ Exemplo carregado! Este exemplo tem soluções com números primos (7 e 11).</p>'
  })
})

/**
 * Função otimizada para verificar se um número é primo
 * @param {number} num - Número a ser verificado
 * @returns {boolean} - True se for primo, false caso contrário
 */
function isPrime(num) {
  if (num <= 1) return false
  if (num === 2) return true
  if (num % 2 === 0) return false
  if (num === 3) return true
  if (num % 3 === 0) return false

  // Otimização: verificar apenas números da forma 6k±1
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false
  }
  return true
}

/**
 * Função principal para encontrar o caminho com menor energia prima
 * Usa uma abordagem de busca em largura modificada (Dijkstra) com verificação de números primos
 * @param {number} numPlanets - Número total de planetas
 * @param {Array} portals - Array de portais com {from, to, cost}
 * @param {number} start - Planeta de início
 * @param {number} end - Planeta de destino
 * @returns {Object} - Resultado com sucesso, custo mínimo primo e caminho
 */
function findOptimalPrimePath(numPlanets, portals, start, end) {
  // Criar grafo de adjacência (lista de adjacências)
  const graph = Array.from({ length: numPlanets + 1 }, () => [])

  // Construir o grafo a partir dos portais
  portals.forEach(portal => {
    graph[portal.from].push({ to: portal.to, cost: portal.cost })
  })

  // Verificar se existe pelo menos um caminho do início ao fim
  if (!hasPath(graph, start, end, numPlanets)) {
    return { success: false, debugInfo: 'Não existe caminho entre os planetas especificados.' }
  }

  // Array para debug - armazenar todos os caminhos encontrados
  const allPaths = []

  // Usar uma fila de prioridade simulada para explorar caminhos por custo crescente
  const queue = [{ planet: start, totalCost: 0, path: [start] }]

  // Limitar a busca para evitar explosão combinatorial
  const MAX_ITERATIONS = 10000
  let iterations = 0

  let minPrimeCost = Infinity
  let bestPath = null
  let bestPathDetails = []

  while (queue.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++

    // Ordenar a fila por custo total (implementação simples de fila de prioridade)
    queue.sort((a, b) => a.totalCost - b.totalCost)
    const current = queue.shift()

    const { planet, totalCost, path } = current

    // Se chegamos ao destino, registrar o caminho
    if (planet === end) {
      const pathStr = `${path.join(' → ')} (custo: ${totalCost}, primo: ${isPrime(totalCost) ? 'SIM' : 'NÃO'})`
      allPaths.push(pathStr)

      // Verificar se o custo é primo
      if (isPrime(totalCost) && totalCost < minPrimeCost) {
        minPrimeCost = totalCost
        bestPath = [...path]
        bestPathDetails = path.slice(0, -1).map((p, i) => `${p}→${path[i + 1]}`)
      }
      continue
    }

    // Otimização: se o custo atual já é muito alto, pular (mas manter flexibilidade)
    if (totalCost > 1000) {
      // Limite razoável para evitar explosão
      continue
    }

    // Explorar vizinhos
    for (const neighbor of graph[planet]) {
      const newCost = totalCost + neighbor.cost
      const newPath = [...path, neighbor.to]

      // Evitar ciclos simples (revisitar o mesmo planeta no mesmo caminho)
      if (path.includes(neighbor.to)) {
        continue
      }

      // Evitar caminhos muito longos (otimização)
      if (newPath.length > numPlanets + 2) {
        continue
      }

      queue.push({
        planet: neighbor.to,
        totalCost: newCost,
        path: newPath
      })
    }
  }

  const debugInfo = allPaths.length > 0 ? allPaths.join('<br>') : 'Nenhum caminho completo encontrado.'

  if (bestPath) {
    return {
      success: true,
      minPrimeCost,
      optimalPath: bestPath,
      pathDetails: bestPathDetails,
      debugInfo
    }
  }

  return {
    success: false,
    debugInfo: `Caminhos encontrados mas nenhum com custo primo:<br>${debugInfo}`
  }
}

/**
 * Gera mensagens de erro variadas e educativas para quando não há solução prima
 * @param {string} debugInfo - Informações de debug dos caminhos testados
 * @returns {Object} - Objeto com título, ícone, explicação e exemplos
 */
function generateErrorMessage(debugInfo) {
  // Extrair números dos caminhos para análise
  const foundNumbers = []
  if (debugInfo) {
    const matches = debugInfo.match(/custo: (\d+)/g)
    if (matches) {
      foundNumbers.push(...matches.map(m => parseInt(m.replace('custo: ', ''))))
    }
  }

  // Diferentes tipos de mensagens de erro baseadas nos números encontrados
  const errorTypes = [
    {
      // Tipo 1: Foco na decomposição em fatores primos
      condition: nums => nums.some(n => n > 1 && !isPrime(n)),
      title: '🚫 Missão Intergaláctica Falhou: Nenhum Combustível Primo Detectado!',
      icon: '🔬',
      heading: 'Análise Matemática dos Resultados',
      explanation:
        'Todos os caminhos encontrados resultam em números compostos (não primos). Números compostos podem ser quebrados em fatores menores, tornando-os inadequados para nossos motores quânticos.',
      examples: nums => {
        const composite = nums.find(n => n > 1 && !isPrime(n))
        if (composite) {
          const factors = getFactors(composite)
          return `<strong>Exemplo:</strong> ${composite} = ${factors.join(' × ')} (composto)<br>
                  <strong>Números primos próximos:</strong> ${getNearbyPrimes(composite).join(', ')}`
        }
        return ''
      },
      tip: 'Tente ajustar os custos dos portais para valores que resultem em números primos (2, 3, 5, 7, 11, 13, 17, 19, 23...).'
    },
    {
      // Tipo 2: Foco na teoria dos números primos
      condition: nums => nums.length > 0,
      title: '⚡ Sistema de Navegação Reporta: Energia Não-Prima Detectada!',
      icon: '🧮',
      heading: 'Teorema dos Números Primos Violado',
      explanation:
        "Os números primos são os 'átomos' da matemática - não podem ser divididos por nenhum outro número além de 1 e eles mesmos. Nossos motores estelares só funcionam com essa energia pura e indivisível.",
      examples: nums => {
        const examples = nums.slice(0, 3).map(n => {
          if (n <= 1) return `${n} ≤ 1 (não é primo por definição)`
          if (isPrime(n)) return `${n} (primo ✅)`
          if (n % 2 === 0) return `${n} é par → divisível por 2 (composto)`
          const smallFactor = findSmallestOddFactor(n)
          return `${n} ÷ ${smallFactor} = ${n / smallFactor} (composto)`
        })
        return `<strong>Análise dos resultados:</strong><br>${examples.join('<br>')}`
      },
      tip: 'Números primos são raros! Entre 1 e 100, existem apenas 25 números primos.'
    },
    {
      // Tipo 3: Foco em paridade e propriedades específicas
      condition: nums => nums.some(n => n > 2 && n % 2 === 0),
      title: '🌌 Alerta do Computador de Bordo: Rota com Energia Par Detectada!',
      icon: '⚖️',
      heading: 'Propriedade da Paridade Violada',
      explanation:
        'Encontramos números pares maiores que 2 em suas rotas. Lembre-se: o único número primo par é o 2! Todos os outros números pares são automaticamente compostos pois são divisíveis por 2.',
      examples: nums => {
        const evenNums = nums.filter(n => n > 2 && n % 2 === 0).slice(0, 3)
        if (evenNums.length > 0) {
          const examples = evenNums.map(n => `${n} = 2 × ${n / 2} (par → composto)`)
          return `<strong>Números pares encontrados:</strong><br>${examples.join('<br>')}`
        }
        return ''
      },
      tip: 'Para ter chances de encontrar primos, prefira rotas que resultem em números ímpares (exceto o primo especial 2).'
    },
    {
      // Tipo 4: Mensagem genérica educativa
      condition: () => true,
      title: '🛸 Centro de Controle Informa: Nenhuma Rota Prima Viável!',
      icon: '📚',
      heading: 'Conceitos Fundamentais sobre Números Primos',
      explanation:
        "Um número primo tem exatamente dois divisores: 1 e ele mesmo. Já um número composto tem mais de dois divisores. Nossos sistemas de propulsão quântica requerem a 'pureza matemática' dos números primos.",
      examples: nums => {
        return `<strong>Exemplos de classificação:</strong><br>
                • <span style="color: #00ff88;">2, 3, 5, 7, 11, 13</span> → Primos (✅ compatíveis)<br>
                • <span style="color: #ff6b6b;">4, 6, 8, 9, 10, 12</span> → Compostos (❌ incompatíveis)<br>
                • <span style="color: #ffa500;">1</span> → Nem primo nem composto (neutro)`
      },
      tip: 'Os primeiros números primos são: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...'
    }
  ]

  // Selecionar o tipo de erro mais apropriado
  const selectedError = errorTypes.find(type => type.condition(foundNumbers)) || errorTypes[errorTypes.length - 1]

  return {
    title: selectedError.title,
    icon: selectedError.icon,
    heading: selectedError.heading,
    explanation: selectedError.explanation,
    examples: selectedError.examples ? selectedError.examples(foundNumbers) : null,
    tip: selectedError.tip
  }
}

/**
 * Encontra os fatores primos de um número
 * @param {number} n - Número para fatorar
 * @returns {Array} - Array com os fatores primos
 */
function getFactors(n) {
  const factors = []
  let temp = n

  // Verificar fator 2
  while (temp % 2 === 0) {
    factors.push(2)
    temp /= 2
  }

  // Verificar fatores ímpares
  for (let i = 3; i * i <= temp; i += 2) {
    while (temp % i === 0) {
      factors.push(i)
      temp /= i
    }
  }

  // Se temp > 2, então é um fator primo
  if (temp > 2) {
    factors.push(temp)
  }

  return factors
}

/**
 * Encontra o menor fator ímpar de um número
 * @param {number} n - Número para analisar
 * @returns {number} - Menor fator ímpar
 */
function findSmallestOddFactor(n) {
  if (n % 3 === 0) return 3
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0) return i
    if (n % (i + 2) === 0) return i + 2
  }
  return n
}

/**
 * Encontra números primos próximos a um dado número
 * @param {number} n - Número de referência
 * @returns {Array} - Array com primos próximos
 */
function getNearbyPrimes(n) {
  const primes = []

  // Buscar primos menores
  for (let i = Math.max(2, n - 10); i < n; i++) {
    if (isPrime(i)) primes.push(i)
  }

  // Buscar primos maiores
  for (let i = n + 1; i <= n + 10 && primes.length < 5; i++) {
    if (isPrime(i)) primes.push(i)
  }

  return primes.slice(0, 4)
}
/**
 * Usa busca em profundidade (DFS) simples
 * @param {Array} graph - Grafo de adjacência
 * @param {number} start - Planeta de início
 * @param {number} end - Planeta de destino
 * @param {number} numPlanets - Número total de planetas
 * @returns {boolean} - True se existe caminho, false caso contrário
 */
function hasPath(graph, start, end, numPlanets) {
  const visited = new Set()
  const stack = [start]

  while (stack.length > 0) {
    const current = stack.pop()

    if (current === end) {
      return true
    }

    if (visited.has(current)) {
      continue
    }

    visited.add(current)

    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor.to)) {
        stack.push(neighbor.to)
      }
    }
  }

  return false
}
