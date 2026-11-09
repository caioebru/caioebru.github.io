// =============================================================
//  ROTEIRO — lugares para as próximas viagens.
//  Pesquisa de novembro de 2026. Preços mudam: "a confirmar" quer dizer
//  que nenhuma fonte trazia valor atual.
//
//  Campos de cada lugar:
//    nome, cidade, km (de carro, a partir de Bauru), lat, lng,
//    temas: "aves" | "trilha" | "agua" | "cultura" | "aventura" | "caverna"
//    situacao: "gratis" | "pago" | "agendar" | "fechado" | "confirmar"
//    preco, resumo, dica (opcional), contato (opcional), link (opcional),
//    album (opcional: id da viagem, se já fomos)
// =============================================================

const ROTEIRO = {
  centro: { nome: "Bauru", lat: -22.3246, lng: -49.0871 },

  perto: [
    {
      nome: "Jardim Botânico Municipal", cidade: "Bauru", km: 8, lat: -22.3447, lng: -49.0171,
      temas: ["aves", "trilha"], situacao: "gratis", preco: "Grátis",
      resumo: "321 ha de cerrado e mata, lagos, trilha ecológica de 1.080 m e viveiro de mudas. Dentro dele fica o Refúgio de Vida Silvestre Aimorés, uma mata de brejo estudada pela Unesp por causa das aves.",
      dica: "Foi aqui o passeio do aniversário da Bre, quando apareceu o sagui. A área do brejo vale outra volta só para aves, bem cedo.",
      contato: "Todo dia, das 8h às 16h30 (confirmar).",
      album: "aniversario-bre-2026-08-15",
    },
    {
      nome: "Zoológico Municipal", cidade: "Bauru", km: 9, lat: -22.3412, lng: -49.0198,
      temas: ["aves"], situacao: "pago", preco: "A confirmar",
      resumo: "Ao lado do Jardim Botânico. Bom para fotografar de perto e aprender a reconhecer espécies.",
      contato: "(14) 3231-2632 · ingresso online (cartão e Pix)",
      link: "https://www.zoobauru.com.br",
    },
    {
      nome: "Horto Florestal", cidade: "Bauru", km: 5, lat: -22.3153, lng: -49.0416,
      temas: ["aves", "trilha"], situacao: "gratis", preco: "Grátis",
      resumo: "Trilhas na mata da Estação Experimental. Já foi registrado ali o ninho do murucututu-de-barriga-amarela, uma coruja grande da Mata Atlântica.",
      dica: "Voltem no fim da tarde para tentar ouvir ou ver a coruja.",
      album: "horto-bauru-2026-11-07",
    },
    {
      nome: "Parque Vitória Régia", cidade: "Bauru", km: 3, lat: -22.3315, lng: -49.0584,
      temas: ["aves", "agua"], situacao: "gratis", preco: "Grátis",
      resumo: "Parque urbano com lago e estrutura sobre a água. Fácil para treinar foto de garças, frangos-d'água e martim-pescador.",
      contato: "Av. Nações Unidas, 25-25",
    },
    {
      nome: "Cachoeira da Glória", cidade: "Agudos", km: 30, lat: -22.5488, lng: -49.1152,
      temas: ["agua", "trilha"], situacao: "confirmar", preco: "A confirmar",
      resumo: "Queda baixa, boa para banho, na zona rural de Agudos. Fica no caminho de rotas de mountain bike da região.",
      dica: "Pergunte antes se o acesso passa por área particular.",
      contato: "Turismo de Agudos: (14) 3262-0775 · turismo@agudos.sp.gov.br",
      link: "https://www.turismo.agudos.sp.gov.br/atracao/10/cachoeira-da-gloria-/",
    },
    {
      nome: "Turismo rural de Agudos", cidade: "Agudos", km: 15, lat: -22.472, lng: -48.9884,
      temas: ["cultura"], situacao: "confirmar", preco: "A confirmar",
      resumo: "Fazenda São Benedito, Espaço Arvorar (Dexco) e os pesqueiros Pexe Loko e Recomeço, listados pela prefeitura.",
      contato: "Turismo de Agudos: (14) 3262-0775",
      link: "https://www.turismo.agudos.sp.gov.br/atracao/categoria/",
    },
    {
      nome: "Terra Indígena Araribá", cidade: "Avaí", km: 35, lat: -22.2726, lng: -49.3545,
      temas: ["cultura", "trilha"], situacao: "agendar", preco: "A confirmar",
      resumo: "Aldeia Kopenoti (Terena e Kaingang), a mais antiga, com trilha ecológica, Ponto de Memória e biojoias. Aldeia Ekeruá (Terena), com grafismo, artesanato, oficinas e apresentações.",
      dica: "Um passeio diferente, de cultura e natureza. Precisa agendar com as aldeias.",
      link: "https://static.poder360.com.br/2026/04/Guia-Turistico-das-Aldeias-Indigenas.pdf",
    },
    {
      nome: "Floresta Estadual de Pederneiras", cidade: "Pederneiras", km: 30, lat: -22.3389, lng: -48.8472,
      temas: ["aves", "trilha"], situacao: "fechado", preco: "Sem visitação estruturada",
      resumo: "1.941 ha de área protegida com viveiro florestal. O plano de manejo prevê trilhas e centro de visitantes, mas o uso público ainda não foi implantado.",
      dica: "Vale escrever para a Fundação Florestal e pedir uma visita agendada. As cachoeiras de Santelmo e Vanglória ficam em fazendas particulares, e a entrada não é permitida.",
      link: "https://sigam.ambiente.sp.gov.br/sigam3/Repositorio/511/Documentos/FE_Pederneiras/Plano_Manejo_FEPederneiras.pdf",
    },
    {
      nome: "Rio Tietê e camping", cidade: "Arealva", km: 35, lat: -22.0302, lng: -48.9112,
      temas: ["agua", "aves"], situacao: "confirmar", preco: "Grátis ou day use",
      resumo: "Margens da represa de Ibitinga, com prainhas, pesca e aves aquáticas. O Camping Recanto da Natureza fica a ~33 min de Bauru.",
      dica: "Dormir no camping e fotografar no amanhecer, a melhor hora para as aves.",
    },
    {
      nome: "Trilhas do Arvrão e Orquidário", cidade: "Lençóis Paulista", km: 45, lat: -22.603, lng: -48.8031,
      temas: ["trilha", "aves"], situacao: "gratis", preco: "Grátis (provável)",
      resumo: "Trilha de caminhada e bike em vegetação nativa, onde visitantes contam ter visto animais. O Orquidário Municipal Welthes Repik costuma atrair beija-flores.",
    },
    {
      nome: "Estradas rurais de bike", cidade: "Piratininga, Duartina e Cabrália", km: 40, lat: -22.4146, lng: -49.4084,
      temas: ["trilha", "aventura", "agua"], situacao: "confirmar", preco: "Grátis",
      resumo: "Rota rural muito usada por ciclistas entre Bauru, Duartina, Cabrália Paulista e Piratininga, com uma cachoeira no caminho (pode ser área particular).",
      link: "https://www.wikiloc.com/mountain-biking-trails/bauru-duartina-est-paulistania-cachoeira-bairro-floresta-cabralia-paulista-sem-terra-mapeando-brasi-29800489",
    },
  ],

  alem: [
    {
      nome: "Eclusa de Barra Bonita", cidade: "Barra Bonita", km: 80, lat: -22.4909, lng: -48.5583,
      temas: ["agua"], situacao: "pago", preco: "A confirmar",
      resumo: "Passeio de barco no Tietê passando pela eclusa de 26 m (~12 min para subir ou descer). Opções de 1h40 ou 3h com almoço.",
      dica: "A eclusa fecha em janeiro, a cada dois anos, para manutenção.",
    },
    {
      nome: "Cachoeiras de Botucatu", cidade: "Botucatu", km: 95, lat: -22.888, lng: -48.4411,
      temas: ["agua", "trilha"], situacao: "confirmar", preco: "Grátis ou day use",
      resumo: "Mais de 70 cachoeiras cadastradas. Destaques: Cachoeiras da Pavuna, com trilha, e Cachoeira Indiana. A Cachoeira da Marta está fechada até uma licitação.",
    },
    {
      nome: "Santa Clara Eco Resort", cidade: "Dourado", km: 98, lat: -22.1163, lng: -48.3174,
      temas: ["agua", "trilha", "aves"], situacao: "pago", preco: "Hospedagem (a confirmar)",
      resumo: "360 ha de mata preservada com duas cachoeiras.",
    },
    {
      nome: "Brotas", cidade: "Brotas", km: 120, lat: -22.2901, lng: -48.1051,
      temas: ["aventura", "agua", "trilha"], situacao: "pago", preco: "Day use (a confirmar)",
      resumo: "Capital da aventura: rafting, tirolesa e arvorismo. Cachoeira Cassorova, com boa estrutura, e Cachoeira do Bissoli, de 76 m, em mata atlântica com árvores centenárias.",
    },
    {
      nome: "Cachoeira do Saltão", cidade: "Itirapina", km: 140, lat: -22.2537, lng: -47.8213,
      temas: ["agua", "aves"], situacao: "confirmar", preco: "A confirmar",
      resumo: "Cachoeira em região de cerrado conhecida pelas aves de campo.",
    },
  ],

  petar: {
    nome: "PETAR", completo: "Parque Estadual Turístico do Alto Ribeira",
    cidade: "Iporanga e Apiaí (SP)", km: 400, horas: "~6h de carro", lat: -24.5357, lng: -48.7004,
    resumo: "Mais de 300 cavernas na Mata Atlântica mais preservada de São Paulo, com rios, cachoeiras e muitas aves. Aventura de verdade: caverna com rio, lanterna de cabeça e roupa que molha.",
    nucleos: [
      ["Santana", "O mais procurado: Caverna Santana (a \"rainha\"), Morro Preto, Couto, Água Suja e a cachoeira do Couto."],
      ["Ouro Grosso", "Cavernas com rio, como a Alambari de Baixo e a Ouro Grosso, com mais aventura e água."],
      ["Casa de Pedra", "Uma das maiores bocas de caverna do mundo, com mais de 200 m. A trilha é longa."],
      ["Caboclos", "Mais isolado, com cavernas grandes como a Temimina."],
    ],
    precos: [
      ["Ingresso", "R$ 19 por pessoa, por núcleo (meia R$ 9,50; até 12 anos e 60+ não pagam)"],
      ["Monitor ambiental", "Obrigatório nas cavernas. Um monitor cobra R$ 350/dia para até 2 pessoas"],
      ["Hospedagem", "Pousadas no bairro da Serra, em Iporanga, perto do Núcleo Santana"],
    ],
    dicas: [
      "Fiquem pelo menos 3 dias e façam um núcleo por dia.",
      "A seca (abril a setembro) é a melhor época. Com chuva forte, as cavernas com rio fecham.",
      "Levem luz extra para fotografar nas cavernas.",
      "Emendem com o Parque Estadual Intervales, a ~1h30 dali.",
    ],
    link: "https://www.petaronline.com.br/ingressos/",
  },

  top: [
    {
      nome: "Pantanal Norte", onde: "Transpantaneira e Porto Jofre, MT", lat: -17.3644, lng: -56.7735,
      como: "Voo até Cuiabá + ~250 km de estrada de terra",
      bichos: "Onça-pintada (julho a outubro), arara-azul, tuiuiú, ariranha, jacaré",
      custo: "Pousadas com pensão completa e passeios: de R$ 1.000 a R$ 2.500 a diária do casal (valores antigos). Agosto e setembro esgotam meses antes.",
    },
    {
      nome: "Bonito e Serra da Bodoquena", onde: "MS", lat: -21.1265, lng: -56.4902,
      como: "~900 km de carro (11h) ou voo até Campo Grande",
      bichos: "Peixes na flutuação, arara-vermelha no Buraco das Araras, tucanos",
      custo: "Flutuação no Rio da Prata de R$ 470 a R$ 570 por pessoa. Buraco das Araras ~R$ 160.",
    },
    {
      nome: "Serra da Canastra", onde: "MG", lat: -20.3695, lng: -46.6094,
      como: "~560 km de carro (~8h)",
      bichos: "Tamanduá-bandeira, lobo-guará, pato-mergulhão (ameaçado), Cachoeira Casca d'Anta",
      custo: "Ingresso a confirmar. Pousadas simples em São Roque de Minas.",
    },
    {
      nome: "Parque Estadual Intervales", onde: "Ribeirão Grande, SP", lat: -24.3568, lng: -48.4322,
      como: "~300 km de carro (~4h30)",
      bichos: "433 espécies de aves: uma das melhores áreas de observação de aves de SP",
      custo: "Hospedagem e restaurante dentro do parque (valores a confirmar).",
    },
    {
      nome: "Parque Estadual Carlos Botelho", onde: "São Miguel Arcanjo, SP", lat: -24.1367, lng: -47.9549,
      como: "~280 km de carro (~4h)",
      bichos: "Muriqui, o maior primata das Américas",
      custo: "Hospedaria dentro da floresta (a confirmar).",
    },
    {
      nome: "Ubatuba e Serra do Mar", onde: "Núcleo Picinguaba, SP", lat: -23.3784, lng: -44.8366,
      como: "~500 km de carro (~7h)",
      bichos: "Beija-flores e saíras (a saíra-sete-cores!), mar e mata juntos, trilhas para praias desertas",
      custo: "Orçamento médio.",
    },
    {
      nome: "Parque Nacional do Itatiaia", onde: "RJ e MG", lat: -22.3573, lng: -44.6843,
      como: "~520 km de carro (~7h)",
      bichos: "Aves de altitude, campos e Agulhas Negras, trilhas de dia inteiro",
      custo: "Ingresso comprado online no site do parque (a confirmar).",
    },
    {
      nome: "Chapada dos Veadeiros", onde: "GO", lat: -13.9068, lng: -47.4161,
      como: "Voo até Brasília + ~230 km",
      bichos: "Cerrado de altitude, lobo-guará, cachoeiras e cânions",
      custo: "Ingresso de R$ 17 a R$ 47 (as fontes divergem).",
    },
    {
      nome: "Chapada Diamantina", onde: "BA", lat: -12.7566, lng: -41.5119,
      como: "Voo até Salvador ou Lençóis",
      bichos: "Trilha do Vale do Pati (3 a 5 dias), cachoeiras e grutas",
      custo: "Guia obrigatório no Pati. Orçamento médio.",
    },
    {
      nome: "Cristalino, sul da Amazônia", onde: "Alta Floresta, MT", lat: -9.5969, lng: -55.9311,
      como: "Voo até Alta Floresta + barco",
      bichos: "Cerca de 600 espécies de aves, duas torres de observação de 50 m sobre a copa",
      custo: "R$ 5.100 a R$ 8.200 a diária do casal, tudo incluso. Para uma viagem especial.",
    },
  ],

  sugestao: [
    ["Começo", "PETAR + Intervales numa viagem só, de carro: cavernas e muitas aves."],
    ["Meio", "Serra da Canastra, para tentar o tamanduá-bandeira e o lobo-guará."],
    ["Sonho", "Pantanal Norte entre julho e outubro, para fotografar a onça-pintada."],
  ],

  fontes: [
    ["Social Bauru", "https://socialbauru.com.br/confira-cachoeiras-perto-bauru-voce-visitar/"],
    ["Turismo de Agudos", "https://www.turismo.agudos.sp.gov.br/atracao/categoria/"],
    ["Prefeitura de Pederneiras", "https://www.pederneiras.sp.gov.br/portal/noticias/0/3/5877/memoria-pederneiras-cachoeiras---belezas-naturais"],
    ["Alesp: povos de Avaí", "https://www.al.sp.gov.br/noticia/?id=514573"],
    ["Revista do Instituto Florestal (aves em Bauru)", "https://rif.emnuvens.com.br/revista/article/download/425/398/397"],
    ["Gazeta SP: Barra Bonita", "https://www.gazetasp.com.br/gazeta-mais/cidade-do-interior-de-sao-paulo-e-destino-ideal-para-passeio-de-barco/"],
    ["Dicas de Viagem: PETAR", "https://www.dicasdeviagem.com/o-que-fazer-no-petar/"],
    ["PETAR Danilo (monitor)", "https://www.petardanilo.com.br/p/roteiros-valores-e-hospedagem-petar.html"],
    ["Aves de Intervales", "https://www.ub.edu/portal/documents/7473196/9034679/Volum5_Especies_de_aves_en_el_PN_Intervales.pdf/8569b5a1-0a2b-42fe-d777-68e554bb029f"],
    ["Gazeta SP: Carlos Botelho", "https://www.gazetasp.com.br/turismo/parque-estadual-carlos-botelho-guia-visitacao/"],
    ["Mala de Aventuras: Pantanal", "https://www.maladeaventuras.com/onde-ficar-no-pantanal/"],
    ["Viagens e Caminhos: Bonito", "https://www.viagensecaminhos.com/flutuacao-rio-da-prata-bonito-ms/"],
    ["Mais Goiás: Veadeiros", "https://www.maisgoias.com.br/cidades/visitantes-da-chapada-dos-veadeiros-terao-que-pagar-ingressos-que-variam-de-r-3-a-r-34/"],
    ["Seu Dinheiro: Cristalino", "https://www.seudinheiro.com/2026/lifestyle/hotel-brasileiro-de-luxo-esta-entre-os-50-melhores-do-mundo-e-tem-diarias-a-partir-de-r-5-mil-veja-qual-e-sama/"],
  ],
};
