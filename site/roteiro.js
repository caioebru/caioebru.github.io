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
//    avaliacao (opcional): { nota, resumo, bom: [], atencao: [], fontes: [[nome, link]] } — o que o pessoal fala
//    album (opcional: id da viagem se já fomos, ou uma lista de ids se fomos mais de uma vez).
//    Vale também para o PETAR e para os lugares do TOP 10.
// =============================================================

const ROTEIRO = {
  centro: { nome: "Bauru", lat: -22.3246, lng: -49.0871 },

  perto: [
    {
      nome: "Jardim Botânico Municipal", cidade: "Bauru", km: 8, lat: -22.3447, lng: -49.0171,
      avaliacao: {"nota":"4,6 no Tripadvisor (326 avaliações) · 4,8 no Google (dado de 2022)","bom":["Trilhas fáceis no cerrado e na mata, com mirante","Os primeiros 80 m da trilha são suspensos e dão acesso a cadeirante","Dá para ver saguis e muitas aves","Não precisa agendar"],"atencao":["A entrada fecha às 16h","Boa parte das avaliações é de 2015 a 2017"],"fontes":[["Tripadvisor","https://www.tripadvisor.com/Attraction_Review-g303601-d4409716-Reviews-Municipal_Botanical_Garden_of_Bauru-Bauru_State_of_Sao_Paulo.html"],["Wikiloc","https://www.wikiloc.com/hiking-trails/trilha-ecologica-do-jardim-botanico-municipal-de-bauru-68137529"]]},
      temas: ["aves", "trilha"], situacao: "gratis", preco: "Grátis",
      resumo: "321 ha de cerrado e mata, lagos, trilha ecológica de 1.080 m e viveiro de mudas. Dentro dele fica o Refúgio de Vida Silvestre Aimorés, uma mata de brejo estudada pela Unesp por causa das aves.",
      dica: "Foi aqui o passeio do aniversário da Bre, quando apareceu o sagui. A área do brejo vale outra volta só para aves, bem cedo.",
      contato: "Todo dia, das 8h às 16h30 (confirmar).",
      album: "aniversario-bre-2026-08-15",
    },
    {
      nome: "Zoológico Municipal", cidade: "Bauru", km: 9, lat: -22.3412, lng: -49.0198,
      avaliacao: {"nota":"4,5 no Tripadvisor (~890 avaliações) · 4,7 no Google (~12 mil)","bom":["Limpo, organizado e com muita sombra","Bom para aprender os bichos da região","Estacionamento grande e grátis"],"atencao":["Alguns recintos são pequenos","Muito sol e calor no verão: ir cedo"],"fontes":[["Tripadvisor","https://www.tripadvisor.com/Attraction_Review-g303601-d4559717-Reviews-Parque_Zoologico_Municipal_de_Bauru-Bauru_State_of_Sao_Paulo.html"],["Wanderlog","https://wanderlog.com/place/details/304266/parque-zool%C3%B3gico-municipal-de-bauru"]]},
      temas: ["aves"], situacao: "pago", preco: "A confirmar",
      resumo: "Ao lado do Jardim Botânico. Bom para fotografar de perto e aprender a reconhecer espécies.",
      contato: "(14) 3231-2632 · ingresso online (cartão e Pix)",
      link: "https://www.zoobauru.com.br",
    },
    {
      nome: "Horto Florestal", cidade: "Bauru", km: 5, lat: -22.3153, lng: -49.0416,
      avaliacao: {"resumo":"Quase não há avaliações on-line. Na manhã de vocês lá foram 9 espécies fotografadas, entre elas o bem-te-vi-rajado e a borboleta-do-maracujá.","atencao":["A área de lazer precisa de reforma (um projeto de universitários de 2019 propôs revitalizar)"],"fontes":[["Unisagrado (2019)","https://unisagrado.edu.br/custom/2008/uploads/namidia/novembro_2019/17-11-2019-unisagrado-2.pdf"]]},
      temas: ["aves", "trilha"], situacao: "gratis", preco: "Grátis",
      resumo: "Trilhas na mata da Estação Experimental. Já foi registrado ali o ninho do murucututu-de-barriga-amarela, uma coruja grande da Mata Atlântica.",
      dica: "Voltem no fim da tarde para tentar ouvir ou ver a coruja.",
      album: "horto-bauru-2026-11-07",
    },
    {
      nome: "Parque Vitória Régia", cidade: "Bauru", km: 3, lat: -22.3315, lng: -49.0584,
      avaliacao: {"resumo":"Opiniões divididas: é cartão-postal da cidade, mas uma avaliação recente diz que o parque está mal cuidado.","bom":["Lago e estrutura sobre a água, bons para aves aquáticas"],"atencao":["Reclamação de piso ruim e de uso de drogas nos quiosques antigos: vão de dia"],"fontes":[["Wanderlog","https://extensionembed.wanderlog.com/place/details/10044192"]]},
      temas: ["aves", "agua"], situacao: "gratis", preco: "Grátis",
      resumo: "Parque urbano com lago e estrutura sobre a água. Fácil para treinar foto de garças, frangos-d'água e martim-pescador.",
      contato: "Av. Nações Unidas, 25-25",
    },
    {
      nome: "Cachoeira da Glória", cidade: "Agudos", km: 30, lat: -22.5488, lng: -49.1152,
      avaliacao: {"resumo":"Quase não há relatos de visitantes. Uma reportagem diz que o acesso não é fácil (pela Rodovia Marechal Rondon, km 243,8) e que a prefeitura planejava visitas monitoradas.","fontes":[["JCNET","https://sampi.net.br/bauru/noticias/2209746/regional/2017/10/brotas--botucatu-e-agudos--o-paraiso-das-cachoeiras-no-centro-do-estado"]]},
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
      avaliacao: {"resumo":"Não achei avaliações de visitantes comuns. A Aldeia Ekeruá recebe com agendamento, não cobra entrada e pede doação de alimentos. Uma equipe da Unesp Bauru que visitou destacou a história da comunidade, as plantas medicinais e a feira de artesanato.","fontes":[["Impacto Unesp","https://impactounesp.com.br/visita-a-aldeia-ekerua-pelo-impacto-socioambiental/"],["Gazeta SP","https://www.gazetasp.com.br/turismo/governo-de-sp-lanca-guia-inedito-com-16-aldeias-abertas-ao-turismo/"]]},
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
      avaliacao: {"resumo":"Campistas contam que o Recanto da Natureza tem 12 quiosques (pagos à parte) e entrada a partir das 7h. A prainha municipal era de graça.","fontes":[["MaCamp","https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/arealva/camping-recanto-da-natureza-santa-isabel/"]]},
      temas: ["agua", "aves"], situacao: "confirmar", preco: "Grátis ou day use",
      resumo: "Margens da represa de Ibitinga, com prainhas, pesca e aves aquáticas. O Camping Recanto da Natureza fica a ~33 min de Bauru.",
      dica: "Dormir no camping e fotografar no amanhecer, a melhor hora para as aves.",
    },
    {
      nome: "Trilhas do Arvrão e Orquidário", cidade: "Lençóis Paulista", km: 45, lat: -22.603, lng: -48.8031,
      avaliacao: {"resumo":"Visitantes contam que a trilha tem vegetação nativa e que dá para ver animais.","fontes":[["Tripadvisor","https://www.tripadvisor.com/Attractions-g2344286-Activities-Lencois_Paulista_State_of_Sao_Paulo.html"]]},
      temas: ["trilha", "aves"], situacao: "gratis", preco: "Grátis (provável)",
      resumo: "Trilha de caminhada e bike em vegetação nativa, onde visitantes contam ter visto animais. O Orquidário Municipal Welthes Repik costuma atrair beija-flores.",
    },
    {
      nome: "Estradas rurais de bike", cidade: "Piratininga, Duartina e Cabrália", km: 40, lat: -22.4146, lng: -49.4084,
      avaliacao: {"resumo":"Ciclistas dizem que acessam a cachoeira do caminho sem problema, mas ninguém confirmou se a área é particular.","fontes":[["Wikiloc","https://www.wikiloc.com/mountain-biking-trails/bauru-duartina-est-paulistania-cachoeira-bairro-floresta-cabralia-paulista-sem-terra-mapeando-brasi-29800489"]]},
      temas: ["trilha", "aventura", "agua"], situacao: "confirmar", preco: "Grátis",
      resumo: "Rota rural muito usada por ciclistas entre Bauru, Duartina, Cabrália Paulista e Piratininga, com uma cachoeira no caminho (pode ser área particular).",
      link: "https://www.wikiloc.com/mountain-biking-trails/bauru-duartina-est-paulistania-cachoeira-bairro-floresta-cabralia-paulista-sem-terra-mapeando-brasi-29800489",
    },
  ],

  alem: [
    {
      nome: "Eclusa de Barra Bonita", cidade: "Barra Bonita", km: 80, lat: -22.4909, lng: -48.5583,
      avaliacao: {"resumo":"Não achei avaliações independentes. Quem fez descreve a subida dentro da eclusa, entre paredões de concreto e uma comporta de aço enorme, como a parte mais marcante. Recebe ~15 mil turistas por mês.","fontes":[["Guia da Semana","https://www.guiadasemana.com.br/turismo/noticia/eclusa"],["Quanto Custa Viajar","https://quantocustaviajar.com/blog/?p=55136"]]},
      temas: ["agua"], situacao: "pago", preco: "A confirmar",
      resumo: "Passeio de barco no Tietê passando pela eclusa de 26 m (~12 min para subir ou descer). Opções de 1h40 ou 3h com almoço.",
      dica: "A eclusa fecha em janeiro, a cada dois anos, para manutenção.",
    },
    {
      nome: "Cachoeiras de Botucatu", cidade: "Botucatu", km: 95, lat: -22.888, lng: -48.4411,
      avaliacao: {"resumo":"Sobre a Pavuna, os relatos falam de trilha bem marcada de 20 a 30 min em mata fechada e de cordas de segurança para passar entre as quedas. Dá para ficar o dia todo.","atencao":["Água bem fria","Relatos antigos: confirmar acesso e cobrança"],"fontes":[["Mochileiros","https://www.mochileiros.com/topic/56233-botucatu-s%C3%A3o-paulo-cachoeira-da-pavuna-veu-da-noiva-da-fazenda/"]]},
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
      avaliacao: {"resumo":"Visitantes elogiam as trilhas por vales com muita fauna. Não achei relatos específicos da Cachoeira do Bissoli.","fontes":[["Wanderlog","https://wanderlog.com/place/details/594532/martello-and-spring-waterfalls"]]},
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
      avaliacao: {"resumo":"Os relatos são muito positivos: mesmo quem fez as cavernas mais difíceis diz que valeu a pena.","bom":["A Caverna Santana dá para fazer até com crianças e idosos com algum preparo","Paisagem e cavernas únicas em SP"],"atencao":["A Caverna Temimina exige trilha de ~4h, íngreme e escorregadia","Há limite diário de visitantes: reservem antes","Monitores: de R$ 120 a R$ 220 por pessoa/dia numa fonte antiga"],"fontes":[["Mochileiros","https://www.mochileiros.com/topic/20324-carnaval-nas-cavernas-petar/"],["São Paulo Secreto","https://saopaulosecreto.com/caverna-temimina-chuveiro-suspenso-petar-sao-paulo/"]]},
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
      avaliacao: {"resumo":"Muita gente vê onça: um viajante viu quatro numa viagem só. Mas não é garantido, e há relato de primeiro passeio de barco sem nenhuma.","bom":["Uma das maiores concentrações de onças-pintadas do mundo"],"atencao":["\"Engarrafamento\" de dezenas de barcos em volta de uma onça viralizou","Barcos e pousadas caros","De 3h30 a 5h de estrada de terra"],"fontes":[["Mochileiros","https://www.mochileiros.com/topic/110027-porto-jofrepocon%C3%A9-x-c%C3%A1rceres-mt-pantanal-norte-ecoturismo/"],["TNH1","https://www.tnh1.com.br/noticia/nid/video-de-engarrafamento-de-barcos-para-ver-onca-pintada-no-pantanal-viraliza/"]]},
      como: "Voo até Cuiabá + ~250 km de estrada de terra",
      bichos: "Onça-pintada (julho a outubro), arara-azul, tuiuiú, ariranha, jacaré",
      custo: "Pousadas com pensão completa e passeios: de R$ 1.000 a R$ 2.500 a diária do casal (valores antigos). Agosto e setembro esgotam meses antes.",
    },
    {
      nome: "Bonito e Serra da Bodoquena", onde: "MS", lat: -21.1265, lng: -56.4902,
      avaliacao: {"resumo":"O Rio da Prata é tido como uma das flutuações mais completas de Bonito, com cenário que muda ao longo do rio.","atencao":["É a flutuação mais cansativa, com trecho sem pé (tem barco de apoio)","Fica em Jardim, ~50 km de Bonito","Preço alto, mas tabelado e com almoço"],"fontes":[["Um Viajante","https://www.umviajante.com.br/flutuacao-rio-da-prata-vale-a-pena-valor-e-como-chegar-de-bonito"],["Viaje na Viagem","https://www.viajenaviagem.com/destino/bonito/flutuacoes-em-bonito/"]]},
      como: "~900 km de carro (11h) ou voo até Campo Grande",
      bichos: "Peixes na flutuação, arara-vermelha no Buraco das Araras, tucanos",
      custo: "Flutuação no Rio da Prata de R$ 470 a R$ 570 por pessoa. Buraco das Araras ~R$ 160.",
    },
    {
      nome: "Serra da Canastra", onde: "MG", lat: -20.3695, lng: -46.6094,
      avaliacao: {"resumo":"Muitos relatos de tamanduá-bandeira, lobo-guará, veados e emas, mas uma reportagem passou três dias lá sem ver nenhum.","bom":["Paisagem espetacular","Estrada de terra tranquila: até carro baixo chega"],"atencao":["Dica dos relatos: ser o primeiro carro a entrar no parque","Infraestrutura rústica; passeios 4x4 não são baratos"],"fontes":[["4x4 Brasil","https://www.4x4brasil.com.br/forum/planejamento/78705-serra-da-canastra-1.html"],["O Eco","https://www.oeco.org.br/wp-content/uploads/wp-post-to-pdf-enhanced-cache/1/27242-altos-e-baixos-de-uma-aventura-no-parna-da-serra-da-canastra.pdf"]]},
      como: "~560 km de carro (~8h)",
      bichos: "Tamanduá-bandeira, lobo-guará, pato-mergulhão (ameaçado), Cachoeira Casca d'Anta",
      custo: "Ingresso a confirmar. Pousadas simples em São Roque de Minas.",
    },
    {
      nome: "Parque Estadual Intervales", onde: "Ribeirão Grande, SP", lat: -24.3568, lng: -48.4322,
      avaliacao: {"resumo":"Visitantes elogiam a equipe do parque (atenciosa e bem informada) e a comida caseira, farta e barata.","atencao":["Os últimos ~25 km são de terra","Reserva pela Fundação Florestal"],"fontes":[["Mochileiros","https://www.mochileiros.com/topic/18512-parque-estadual-de-intervales/"],["Neotropical Birding","https://neotropicalbirdclub.org/wp-content/uploads/2019/03/NB24-BS2-Intervales.pdf"]]},
      como: "~300 km de carro (~4h30)",
      bichos: "433 espécies de aves: uma das melhores áreas de observação de aves de SP",
      custo: "Hospedagem e restaurante dentro do parque (valores a confirmar).",
    },
    {
      nome: "Parque Estadual Carlos Botelho", onde: "São Miguel Arcanjo, SP", lat: -24.1367, lng: -47.9549,
      avaliacao: {"resumo":"Tem a Trilha da Canela (2024), de 2,1 km, chamada de maior trilha suspensa do mundo dentro de uma área protegida. Os muriquis foram vistos na visita de inauguração.","atencao":["Não há restaurante dentro do parque: levem comida","Não compensa em dia frio e chuvoso","Precisa agendar"],"fontes":[["SEMIL","https://semil.sp.gov.br/?p=120723"],["Gazeta SP","https://www.gazetasp.com.br/turismo/parque-estadual-carlos-botelho-guia-visitacao/"]]},
      como: "~280 km de carro (~4h)",
      bichos: "Muriqui, o maior primata das Américas",
      custo: "Hospedaria dentro da floresta (a confirmar).",
    },
    {
      nome: "Ubatuba e Serra do Mar", onde: "Núcleo Picinguaba, SP", lat: -23.3784, lng: -44.8366,
      avaliacao: {"resumo":"O Sítio Folha Seca é o ponto mais famoso de Ubatuba para fotografar beija-flores: uma casa com comedouros na varanda, cheia de observadores de aves.","bom":["Rota das Aves com mais de 20 espécies de beija-flores"],"fontes":[["10.000 Birds","https://www.10000birds.com/ubatuba-sao-paulo-brazil-profile-for-birders.htm"],["São Paulo Secreto","https://saopaulosecreto.com/birdwatching-em-sp/"]]},
      como: "~500 km de carro (~7h)",
      bichos: "Beija-flores e saíras (a saíra-sete-cores!), mar e mata juntos, trilhas para praias desertas",
      custo: "Orçamento médio.",
    },
    {
      nome: "Parque Nacional do Itatiaia", onde: "RJ e MG", lat: -22.3573, lng: -44.6843,
      avaliacao: {"resumo":"Quem foi diz que vale muito a pena: a vista do Prateleiras é muito elogiada.","atencao":["Agulhas Negras: ~3h de subida, moderada a difícil, com trechos técnicos (guia recomendado)","Melhor de maio a outubro, mas faz muito frio: casaco, gorro e luvas","A parte alta só deixa entrar das 7h às 14h"],"fontes":[["Mala de Aventuras","https://maladeaventuras.com/pico-das-agulhas-negras/"],["Mochileiros","https://www.mochileiros.com/topic/30676-pico-das-agulhas-negras-e-prateleiras-parna-itatiaia/"]]},
      como: "~520 km de carro (~7h)",
      bichos: "Aves de altitude, campos e Agulhas Negras, trilhas de dia inteiro",
      custo: "Ingresso comprado online no site do parque (a confirmar).",
    },
    {
      nome: "Chapada dos Veadeiros", onde: "GO", lat: -13.9068, lng: -47.4161,
      avaliacao: {"resumo":"Muito elogiada pela natureza e pela estrutura turística.","atencao":["Ingressos e trilhas com limite diário: comprem antes","Cheguem cedo em fins de semana e feriados","Guia em algumas trilhas, pouco sinal de celular e carrapatos"],"fontes":[["Travel.com.br","https://travel.com.br/chapada-dos-veadeiros/"],["Seguros Promo","https://www.segurospromo.com.br/blog/chapada-dos-veadeiros/"]]},
      como: "Voo até Brasília + ~230 km",
      bichos: "Cerrado de altitude, lobo-guará, cachoeiras e cânions",
      custo: "Ingresso de R$ 17 a R$ 47 (as fontes divergem).",
    },
    {
      nome: "Chapada Diamantina", onde: "BA", lat: -12.7566, lng: -41.5119,
      avaliacao: {"resumo":"Muita gente chama o Vale do Pati de trilha mais bonita do Brasil. As noites nas casas de nativos, com fogueira e histórias, são o que mais se lembra.","atencao":["Moderada a difícil, com muita subida e descida","A trilha não tem marcação: guia recomendado","Há acidentes com resgate de helicóptero"],"fontes":[["Mala de Aventuras","https://maladeaventuras.com/tudo-que-voce-precisa-saber-para-planejar-seu-trekking-pelo-vale-do-pati/"],["Mochileiros","https://www.mochileiros.com/topic/24846-descomplicando-o-vale-do-pati-com-ou-sem-guia-fotos"]]},
      como: "Voo até Salvador ou Lençóis",
      bichos: "Trilha do Vale do Pati (3 a 5 dias), cachoeiras e grutas",
      custo: "Guia obrigatório no Pati. Orçamento médio.",
    },
    {
      nome: "Cristalino, sul da Amazônia", onde: "Alta Floresta, MT", lat: -9.5969, lng: -55.9311,
      avaliacao: {"nota":"4,8 no Google (495 avaliações)","resumo":"Hóspedes elogiam muito as acomodações e o serviço, e a torre de observação sobre a copa é o destaque.","atencao":["Só vende pacote, normalmente com mínimo de 3 noites","Acesso só de barco"],"fontes":[["Enprimeur","https://www.enprimeurclub.com/hotels/cristalino-lodge-alta-floresta-hotel"],["Wildlife Worldwide","https://www.wildlifeworldwide.com/accommodation/cristalino-jungle-lodge"]]},
      como: "Voo até Alta Floresta + barco",
      bichos: "Cerca de 600 espécies de aves, duas torres de observação de 50 m sobre a copa",
      custo: "R$ 5.100 a R$ 8.200 a diária do casal, tudo incluso. Para uma viagem especial.",
    },
  ],

  // Lugares diferentes: abandonados, curiosos ou com história estranha.
  // Muitos são particulares ou estão em mau estado: vejam de fora e de dia.
  diferentes: [
    {
      "nome": "Igrejinha da Dona Ana",
      "cidade": "Espírito Santo do Turvo",
      "km": 75,
      "lat": -22.694,
      "lng": -49.4295,
      "aprox": true,
      "resumo": "Uma capela antiga e abandonada no meio da zona rural, no caminho para o bairro São João do Turvo. Os moradores a chamam de \"Igrejinha da Dona Ana\", e a própria prefeitura diz que ela rende fotos lindas.",
      "dica": "Ninguém sabe ao certo quem foi Dona Ana: perguntem na cidade, a história deve ser boa. O pino é da cidade; peçam a direção por lá.",
      "link": "https://www.espiritosantodoturvo.sp.gov.br/noticia/3364/turismo-rural-conheca-a-igrejinha-da-dona-ana/"
    },
    {
      "nome": "Estação de Tibiriçá e a noiva fantasma",
      "cidade": "Tibiriçá, distrito de Bauru",
      "km": 20,
      "lat": -22.1965,
      "lng": -49.1987,
      "resumo": "Estação da antiga Noroeste, de 1906, abandonada mas tombada, com trilhos e o armazém ainda de pé. O distrito tem uma lenda famosa: uma noiva fantasma que anda pelas estradas de terra pedindo para levantarem o véu dela.",
      "dica": "Vão de dia e vejam por fora. Combina com uma volta pelas estradas rurais do distrito.",
      "link": "https://pt.wikipedia.org/wiki/Tibiri%C3%A7%C3%A1_(Bauru)"
    },
    {
      "nome": "Ruínas da Estação da Noroeste",
      "cidade": "Centro de Bauru",
      "km": 1,
      "lat": -22.3235,
      "lng": -49.0786,
      "resumo": "A estação grandiosa onde chegavam três ferrovias (Noroeste, Paulista e Sorocabana). Recebeu o último trem de passageiros em 2001 e desde então vai se desfazendo. No pátio ao lado ainda há centenas de vagões velhos, que a concessionária anunciou que vai retirar.",
      "dica": "Vejam só por fora e de dia: o prédio é ocupado e está em mau estado. Corram, porque os vagões do pátio devem sumir em breve.",
      "link": "https://outracidade.com.br/por-que-as-ruinas-da-estacao-de-bauru-sao-uma-enorme-esperanca/"
    },
    {
      "nome": "Caça às estações da Noroeste",
      "cidade": "Agudos, Piratininga, Avaí, Cabrália, Duartina e Pederneiras",
      "km": 45,
      "lat": -22.4146,
      "lng": -49.4084,
      "aprox": true,
      "resumo": "As cidades em volta de Bauru têm estações antigas da ferrovia Noroeste abandonadas, alvo até de ação do Ministério Público Federal. Dá um roteiro de carro de um dia, parando em cada uma.",
      "dica": "Muitas são da União ou estão em áreas fechadas: fotografem de fora.",
      "link": "https://www.archdaily.com/pt//901210/estacoes-ferroviarias-de-sao-paulo-viram-ruina-e-uniao-pode-ser-obrigada-a-recuperar-os-imoveis"
    },
    {
      "nome": "Museu Ferroviário Regional",
      "cidade": "Bauru",
      "km": 1,
      "lat": -22.3224,
      "lng": -49.0777,
      "resumo": "Ao lado da estação, conta a história das três ferrovias de Bauru com objetos, fotos e vagões. Bom para entender as ruínas antes de sair caçando estações.",
      "preco": "Grátis",
      "contato": "(14) 3212-8262",
      "link": "https://www2.bauru.sp.gov.br/materia.aspx?n=33918"
    },
    {
      "nome": "Museu de Paleontologia de Marília",
      "cidade": "Marília",
      "km": 110,
      "lat": -22.2209,
      "lng": -49.9483,
      "resumo": "Fósseis de dinossauros do Cretáceo encontrados na região, com destaque para os titanossauros, e óculos de realidade virtual. Prova de que o interior paulista já foi terra de dinossauro.",
      "preco": "Grátis",
      "contato": "Terça a sexta, 8h–11h30 e 13h–16h30; sábado e domingo, 13h–16h30 (confirmar)",
      "link": "https://www.uai.com.br/curiosidades/2025/11/15/a-cidade-brasileira-onde-os-dinossauros-deixaram-pegadas/"
    },
    {
      "nome": "Gigante Adormecido e Três Pedras",
      "cidade": "Bofete, Pardinho e Botucatu",
      "km": 110,
      "lat": -23.0126,
      "lng": -48.3093,
      "resumo": "Uma serra que, vista de longe, parece um homem gigante deitado; as Três Pedras são os pés dele. Dá para ver de mirantes como o Ecoparque Pedra do Índio, em Botucatu.",
      "dica": "Combina com as cachoeiras de Botucatu no mesmo fim de semana.",
      "link": "https://al.sp.gov.br/noticia/?id=514983"
    },
    {
      "nome": "Japurá, a vila fantasma",
      "cidade": "Tabapuã (noroeste paulista)",
      "km": 230,
      "lat": -20.9966,
      "lng": -49.1223,
      "resumo": "Um vilarejo ferroviário que chegou a ter 3 mil moradores, com farmácia, escola, igreja e até cadeia, e hoje está praticamente vazio, com ruas tomadas pelo mato. Malária, crise e o fim do trem esvaziaram a vila.",
      "dica": "Construções em mau estado: não entrem nelas. Perguntem antes na prefeitura de Tabapuã.",
      "link": "https://www.gazetasp.com.br/turismo/entre-trilhos-e-silencio-a-vila-paulista-que-ficou-deserta-apos-uma-pandemia/"
    }
  ],

  // Onde acampar. "area" agrupa os cards; "aprox: true" quando a coordenada é da cidade.
  // Quase todos os preços vêm de relatos antigos de viajantes: confirmar antes.
  campings: [
    {
      area: "Região de Bauru", nome: "Camping Recanto da Natureza", cidade: "Arealva (bairro Santa Isabel, SP-321)", lat: -22.0302, lng: -48.9112, aprox: true,
      avaliacao: {"resumo":"Num relato de 2020, campistas contam que o camping vai das 7h até as 18h do dia seguinte e que os quiosques são cobrados à parte.","fontes":[["MaCamp","https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/arealva/camping-recanto-da-natureza-santa-isabel/"]]},
      preco: "R$ 20 o pernoite e R$ 8 o day use (relato de 2020)",
      resumo: "Camping com boa estrutura, ~33 min de Bauru, perto do Tietê. Entrada a partir das 7h e saída até as 18h do dia seguinte. Os 12 quiosques são cobrados à parte.",
      link: "https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/arealva/camping-recanto-da-natureza-santa-isabel/",
    },
    {
      area: "Região de Bauru", nome: "Praia Municipal de Arealva", cidade: "Arealva", lat: -22.025, lng: -48.905, aprox: true,
      preco: "Grátis (informação antiga)",
      resumo: "Prainha de rio onde era permitido acampar sem pagar. Bom para dormir na beira do Tietê e fotografar as aves aquáticas no amanhecer.",
      link: "https://socialbauru.com.br/conheca-mais-de-6-praias-de-rio-na-regiao-de-bauru/",
    },
    {
      area: "Brotas e Itirapina (até ~2h30)", nome: "Camping Cachoeira 3 Quedas", cidade: "Brotas (bairro Patrimônio, 12 km do centro)", lat: -22.2901, lng: -48.1051, aprox: true,
      preco: "R$ 50 por pessoa (relato de 2015)",
      resumo: "Camping com cachoeira, banheiros limpos, água quente, lava-pratos e energia elétrica.",
    },
    {
      area: "Brotas e Itirapina (até ~2h30)", nome: "Cachoeira Véu de Noiva (Astor)", cidade: "Brotas", lat: -22.2901, lng: -48.1051, aprox: true,
      preco: "A confirmar",
      resumo: "Mais rústico, com lanchonete, camping, quiosques de churrasco e tirolesa. A atração é a natureza.",
    },
    {
      area: "Brotas e Itirapina (até ~2h30)", nome: "Cachoeira do Saltão", cidade: "Itirapina", lat: -22.2537, lng: -47.8213, aprox: true,
      preco: "Day use R$ 25 por pessoa (relato de 2017); camping a confirmar",
      resumo: "Propriedade com três quedas d'água, piscina natural, tirolesa e área de camping.",
    },
    {
      area: "PETAR", nome: "Camping do Núcleo Santana", cidade: "Dentro do PETAR, Iporanga", lat: -24.5357, lng: -48.7004,
      preco: "Cerca de R$ 18 o pernoite por pessoa, além do ingresso (confirmar)",
      resumo: "Área de camping dentro do parque, com banheiros, chuveiros, lavanderia e ambulatório. Dá para sair da barraca direto para as cavernas.",
      dica: "Precisa reservar.",
      link: "https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/petar/camping-nucleo-santana/",
    },
    {
      area: "PETAR", nome: "Campings do bairro da Serra", cidade: "Iporanga (13 km da cidade)", lat: -24.53, lng: -48.69, aprox: true,
      preco: "A confirmar",
      resumo: "O bairro da Serra é a porta de entrada dos núcleos Santana e Ouro Grosso e tem campings e pousadas, como o Camping Iguinhos Clube.",
      link: "https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/petar/camping-iguinhos-clube/",
    },
    {
      area: "TOP 10", nome: "Camping do Abrigo Rebouças", cidade: "Parque Nacional do Itatiaia, parte alta (Itamonte, MG)", lat: -22.386, lng: -44.671, aprox: true,
      avaliacao: {"resumo":"Campistas avisam que conseguir a reserva já é uma aventura: reservem bem antes. O camping não tem fogão, só o abrigo.","fontes":[["Mochileiros","https://www.mochileiros.com/topic/30676-pico-das-agulhas-negras-e-prateleiras-parna-itatiaia/"]]},
      preco: "A partir de R$ 75 por barraca por noite (até 3 adultos)",
      resumo: "O camping mais alto do Brasil, a mais de 2.000 m, com até 20 barracas. É a base para as Agulhas Negras e as travessias Rebouças–Mauá e Serra Negra.",
      dica: "Reserve pela concessionária do parque. O camping não tem fogão; acampar nos picos é proibido.",
      link: "https://pnitatiaia.com.br/en/",
    },
    {
      area: "TOP 10", nome: "Campings da Serra da Canastra", cidade: "São Roque de Minas, perto da parte baixa da Casca d'Anta", lat: -20.3027, lng: -46.5245, aprox: true,
      preco: "A confirmar (pousadas a partir de R$ 270 o quarto duplo)",
      resumo: "Camping Paraíso Perdido, Pousada Dois Irmãos (bem perto da parte baixa da Casca d'Anta) e Camping da Crioula. Uma fonte diz que a entrada do parque é gratuita.",
    },
    {
      area: "TOP 10", nome: "Campings de São Jorge", cidade: "Chapada dos Veadeiros (GO)", lat: -14.1697, lng: -47.8166, aprox: true,
      preco: "De R$ 25 a R$ 40 por pessoa (relatos antigos)",
      resumo: "A vila na porta do parque tem vários campings, como o Pachamama. Na temporada seca também dá para acampar dentro do parque nas travessias Sete Quedas e São Jorge–Capela.",
    },
    {
      area: "TOP 10", nome: "Camping do Balneário Municipal", cidade: "Bonito (MS), às margens do Rio Formoso", lat: -21.17, lng: -56.45, aprox: true,
      preco: "A confirmar",
      resumo: "Área de camping na beira do rio, com lanchonete, restaurante, sanitários e churrasqueiras. Na Serra da Bodoquena, o Refúgio Canaã cobra cerca de R$ 50 a diária (relato sem data).",
    },
    {
      area: "TOP 10", nome: "Camping em Porto Jofre", cidade: "Fim da Transpantaneira, Pantanal (MT)", lat: -17.3644, lng: -56.7735,
      preco: "Uma pequena taxa por barraca ou carro (a confirmar)",
      resumo: "Camping atrás do Hotel Porto Jofre, na beira do Rio Cuiabá, a base dos barcos que procuram onças. No começo da estrada, a Pousada Piuval (km 10) e o Portal Paraíso também têm camping.",
      dica: "Acampar solto na beira da estrada é possível, mas é região de onça e jacaré: prefira os campings.",
    },
    {
      area: "TOP 10", nome: "Casas de nativos no Vale do Pati", cidade: "Chapada Diamantina (BA)", lat: -12.7566, lng: -41.5119, aprox: true,
      preco: "Em pacotes com guia (a confirmar)",
      resumo: "No Pati se dorme nas casas das famílias do vale, em quarto ou barraca no quintal, com comida caseira. No Vale do Capão, vizinho, há campings a partir de ~US$ 9 a noite.",
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
    ["MaCamp: Recanto da Natureza", "https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/arealva/camping-recanto-da-natureza-santa-isabel/"],
    ["Social Bauru: praias de rio", "https://socialbauru.com.br/conheca-mais-de-6-praias-de-rio-na-regiao-de-bauru/"],
    ["MaCamp: camping do Núcleo Santana", "https://macamp.com.br/guia/guia/campings/brasil/sao-paulo/petar/camping-nucleo-santana/"],
    ["Dicas de Viagem: onde ficar no PETAR", "https://www.dicasdeviagem.com/onde-ficar-perto-do-petar/"],
    ["Mochileiros: Brotas", "https://www.mochileiros.com/topic/40404-brotas-s%C3%A3o-paulo/"],
    ["Catraca Livre: Itatiaia", "https://catracalivre.com.br/viagem-livre/guia-parque-nacional-de-itatiaia/"],
    ["Viciada em Viajar: Canastra", "https://www.viciadaemviajar.com/o-que-fazer-na-serra-da-canastra"],
    ["Mochileiros: campings de São Jorge", "https://www.mochileiros.com/topic/58349-relato-completo-chapada-dos-veadeiros-gastos-fotos/"],
    ["Viagens e Caminhos: Balneário de Bonito", "https://www.viagensecaminhos.com/balneario-municipal-de-bonito-ms/"],
    ["Pitchup: Camping Porto Jofre", "https://www.pitchup.com/pt-br/campsites/brazil/central-west-region/mato-grosso/porto_jofre/camping_porto_jofre"],
    ["Mamut: Vale do Pati", "https://mamut.agency/en/aventuras/pati-valley-3-days/"],
  ],
};
