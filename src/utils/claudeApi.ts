import { AIAction } from './types';

export const generateClaudeResponse = async (content: string, action: string): Promise<string> => {
  const prompt = getPromptForAction(action, content);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Erro na chamada da API Claude:", error);
    throw error;
  }
};

function getPromptForAction(action: string, content: string): string {
  const reportExample = `<example>
<EXAME>
RESSONÂNCIA MAGNÉTICA DO ABDOME SUPERIOR
</EXAME>
<ACHADOS>
Pequena hérnia gástrica hiatal. Fígado com forma, contornos e dimensões normais, com sinais de deposição gordurosa (6,8%), observando-se área de distúrbio perfusional nos segmentos V, VI, VII e VIII, de aspecto incaracterístico.
Dois nódulos com características de hemangiomas no segmento VII, medindo até 1,0 cm.
Cistos hepáticos esparsos, medindo até 0,8 cm.
Veias porta e hepáticas pérvias.
Ausência de dilatação das vias biliares intra- e extra-hepáticas.
Divertículo na segunda porção duodenal, medindo 2,0 cm.
Pâncreas com atrofia parenquimatosa em padrão usual para a faixa etária. Não há dilatação do ducto pancreático principal.
Baço de dimensões normais apresentando formação nodular em seu terço inferior, com calcificações periféricas e com áreas de gordura microscópica, de aspecto inespecífico.
Adrenais sem particularidades.
Rins tópicos, de dimensões normais, apresentando cistos subcentimétricos.
Aorta abdominal com trajeto e calibre preservados. Ateromatose aórtica. Ausência de líquido livre no abdome superior.
Lesão expansiva subestenosante de limites mal definidos no cólon transverso, junto ao ângulo hepático, medindo cerca de 6,5 x 3,5 cm, com sinais de acometimento transmural, notadamente em seu contorno medial. Observam-se linfonodos aumentados junto às veias de drenagem, medindo até cerca de 1,0 cm, suspeitos para acometimento neoplásico secundário.
Divertículos cólicos difusos, sem sinais de processo inflamatório agudo associado.
</ACHADOS>
<ideal_output>
RESSONÂNCIA MAGNÉTICA DO ABDOME SUPERIOR
Técnica:
Exame realizado pelas técnicas TSE e GRE com imagens multiplanares ponderadas em T1 e T2, antes e após a administração intravenosa do meio de contraste paramagnético (gadolínio).
Análise:
Pequena hérnia gástrica hiatal. Fígado com forma, contornos e dimensões normais, com sinais de deposição gordurosa (6,8%), observando-se área de distúrbio perfusional nos segmentos V, VI, VII e VIII, de aspecto incaracterístico.
Dois nódulos com características de hemangiomas no segmento VII, medindo até 1,0 cm.
Cistos hepáticos esparsos, medindo até 0,8 cm.
Veias porta e hepáticas pérvias.
Ausência de dilatação das vias biliares intra- e extra-hepáticas.
Divertículo na segunda porção duodenal, medindo 2,0 cm.
Pâncreas com atrofia parenquimatosa em padrão usual para a faixa etária. Não há dilatação do ducto pancreático principal.
Baço de dimensões normais apresentando formação nodular em seu terço inferior, com calcificações periféricas e com áreas de gordura microscópica, de aspecto inespecífico.
Adrenais sem particularidades.
Rins tópicos, de dimensões normais, apresentando cistos subcentimétricos.
Aorta abdominal com trajeto e calibre preservados. Ateromatose aórtica. Ausência de líquido livre no abdome superior.
Lesão expansiva subestenosante de limites mal definidos no cólon transverso, junto ao ângulo hepático, medindo cerca de 6,5 x 3,5 cm, com sinais de acometimento transmural, notadamente em seu contorno medial. Observam-se linfonodos aumentados junto às veias de drenagem, medindo até cerca de 1,0 cm, suspeitos para acometimento neoplásico secundário.
Divertículos cólicos difusos, sem sinais de processo inflamatório agudo associado.
</ideal_output>
</example>`;

  const impressionsExample = `<example>
<EXAME>
RESSONÂNCIA MAGNÉTICA DO ABDOME SUPERIOR
</EXAME>
<ACHADOS>
Lesão expansiva subestenosante de limites mal definidos no cólon transverso, junto ao ângulo hepático, medindo cerca de 6,5 x 3,5 cm, com sinais de acometimento transmural e linfonodos aumentados suspeitos para acometimento neoplásico secundário.
Esteatose hepática leve (6,8%).
Hemangiomas hepáticos e cistos hepáticos esparsos.
Diverticulose cólica sem sinais de complicação aguda.
</ACHADOS>
<ideal_output>
IMPRESSÃO:
- Lesão expansiva no cólon transverso com características sugestivas de neoplasia primária e suspeita de acometimento linfonodal secundário
- Esteatose hepática leve
- Hemangiomas e cistos hepáticos de aspecto típico
- Diverticulose cólica sem sinais de complicação aguda

RECOMENDAÇÕES:
- Sugere-se avaliação colonoscópica com biópsia da lesão
- Considerar estadiamento complementar com TC de tórax
- Acompanhamento dos nódulos hepáticos em 6 meses
</ideal_output>
</example>`;

  const followUpExample = `<example>
<EXAME>
RESSONÂNCIA MAGNÉTICA DO ABDOME SUPERIOR
</EXAME>
<ACHADOS>
Lesão expansiva subestenosante no cólon transverso medindo 6,5 x 3,5 cm com linfonodomegalias associadas.
Nódulos hepáticos com características de hemangiomas.
Esteatose hepática leve.
</ACHADOS>
<ideal_output>
RECOMENDAÇÕES DE SEGUIMENTO:

1. AVALIAÇÃO IMEDIATA (até 7 dias):
- Colonoscopia com biópsia da lesão colônica
- TC de tórax para estadiamento
- Avaliação com oncologista

2. CURTO PRAZO (1-3 meses):
- Marcadores tumorais (CEA, CA 19-9)
- TC de abdome e pelve com protocolo trifásico
- Retorno ao cirurgião oncológico com resultados

3. MÉDIO PRAZO (6 meses):
- RM de abdome para controle dos nódulos hepáticos
- Avaliação da resposta ao tratamento instituído

4. LONGO PRAZO (anual):
- Controle da esteatose hepática
- Seguimento oncológico conforme protocolo

EXAMES COMPLEMENTARES SUGERIDOS:
- PET-CT para estadiamento sistêmico
- Considerar RM de pelve para avaliação local detalhada

ENCAMINHAMENTOS:
- Cirurgião oncológico (urgente)
- Oncologista clínico (urgente)
- Nutricionista (eletivo)
</ideal_output>
</example>`;

  const enhanceExample = `<example>
<EXAME>
TC DE ABDOME
</EXAME>
<ACHADOS>
Fígado aumentado com nódulo no segmento VII.
Vesícula com cálculos.
Baço normal.
Rins normais.
</ACHADOS>
<ideal_output>
TOMOGRAFIA COMPUTADORIZADA DO ABDOME

TÉCNICA:
Exame realizado em equipamento multidetector com 64 canais, com aquisições volumétricas antes e após a administração endovenosa do meio de contraste iodado não-iônico, em fases arterial (35s), portal (70s) e de equilíbrio (180s). Espessura de corte: 2,5mm. Incremento: 1,25mm.

ANÁLISE:
Fígado apresentando dimensões aumentadas (diâmetro craniocaudal do lobo direito: 17,8 cm), contornos regulares e densidade parenquimatosa preservada. Identifica-se formação nodular no segmento VII, medindo 2,3 x 2,1 cm, hipodensa na fase sem contraste (35 UH), apresentando realce globular periférico descontínuo na fase arterial e preenchimento centrípeto progressivo nas fases portal e de equilíbrio, aspectos sugestivos de hemangioma.

Vesícula biliar de dimensões normais, apresentando paredes finas e regulares, com múltiplos cálculos em seu interior, medindo até 0,8 cm, móveis às diferentes posições de decúbito. Ausência de sinais de colecistite.

Baço de dimensões normais (diâmetro craniocaudal: 9,8 cm), contornos regulares e densidade homogênea, sem evidências de lesões focais.

Rins tópicos, simétricos, com dimensões, contornos e espessura do parênquima preservados. Ausência de cálculos, massas ou hidronefrose. Densidade do parênquima e padrão de realce pós-contraste dentro da normalidade.

IMPRESSÃO:
- Hepatomegalia leve
- Hemangioma hepático típico no segmento VII
- Colecistolitíase sem sinais de complicação aguda
</ideal_output>
</example>`;

  switch (action) {
    case AIAction.GENERATE_REPORT:
      return `<examples>${reportExample}</examples>

Você é laudAI, um assistente de radiologia altamente especializado. Sua tarefa é gerar um laudo radiológico detalhado e profissional com base no tipo de exame e nos achados fornecidos. Siga estas instruções cuidadosamente:

1. Informações do Exame:
   O tipo de exame será fornecido em:
   <exame>${content.split('\n')[0]}</exame>
   
   Os achados radiológicos serão fornecidos em:
   <achados>${content}</achados>

2. Planejamento do Laudo:
   Antes de escrever o laudo final, organize seus pensamentos nas tags <planejamento_laudo>. Inclua:
   a) Lista e categorização dos principais achados por estrutura anatômica
   b) Identificação separada de achados positivos e negativos
   c) Medidas ou detalhes específicos a serem incluídos
   d) Possíveis diagnósticos com base nos achados
   e) Planejamento da ordem de apresentação no laudo

3. Estrutura do Laudo:
   Seu laudo deve conter as seguintes seções:
   a) Título: Reafirme o tipo de exame
   b) Técnica: Descreva brevemente a técnica utilizada, incluindo o uso de contraste e sequências de imagem
   c) Análise: Detalhe os achados de imagem relevantes
   d) Impressão: (Se necessário) Resuma os achados positivos mais importantes

4. Diretrizes para a Análise:
   - Liste primeiro os achados positivos, um por linha
   - Use terminologia radiológica precisa e inclua medidas quando relevante
   - Refine descrições vagas para serem mais profissionais e precisas
   - Descreva achados negativos relevantes de forma concisa
   - Para lesões, descreva realce, conteúdo e/ou sinal na RM quando aplicável
   - Seja direto e evite frases introdutórias desnecessárias
   - Não pule linhas entre frases na seção Análise
   - Mantenha cada estrutura em uma linha, mas seja o mais compacto possível

5. Diretrizes para a Impressão:
   - Resuma apenas os achados positivos mais importantes
   - Liste em ordem de importância
   - Não inclua medidas nesta seção
   - Comece cada linha com um traço (-) e um espaço

6. Diretrizes Gerais:
   - Escreva em português brasileiro, usando vocabulário radiológico preciso
   - Use todos os acentos e gramática perfeita
   - Foque em detalhar os achados positivos, sendo mais conciso nos negativos
   - Adapte os achados negativos ao contexto do achado principal`;

    case AIAction.GENERATE_IMPRESSIONS:
      return `<examples>${impressionsExample}</examples>

Como radiologista experiente no Brasil, forneça uma impressão diagnóstica concisa em português brasileiro para o seguinte exame:

<exame>${content.split('\n')[0]}</exame>
<achados>${content}</achados>

Diretrizes para a Impressão:

1. ACHADOS PRINCIPAIS
- Liste apenas os achados mais relevantes em ordem de importância clínica
- Use marcador (-) no início de cada linha
- Mantenha objetividade e precisão
- Não inclua medidas nesta seção
- Use terminologia radiológica precisa

2. CORRELAÇÕES CLÍNICAS
- Relacione achados com possíveis diagnósticos
- Indique grau de suspeição para malignidade quando aplicável
- Sugira diagnósticos diferenciais em ordem de probabilidade
- Correlacione com dados clínicos quando disponíveis

3. RECOMENDAÇÕES
- Destaque achados que requerem ação imediata
- Sugira exames complementares quando necessário
- Indique intervalo de seguimento quando apropriado
- Recomende correlação clínico-laboratorial se pertinente

4. FORMATAÇÃO
- Separe em seções: IMPRESSÃO e RECOMENDAÇÕES
- Use linguagem clara e direta
- Mantenha consistência na formatação
- Priorize informações clinicamente relevantes`;

    case AIAction.FOLLOW_UP:
      return `<examples>${followUpExample}</examples>

Como radiologista experiente no Brasil, forneça recomendações de seguimento detalhadas em português brasileiro para o seguinte exame:

<exame>${content.split('\n')[0]}</exame>
<achados>${content}</achados>

Diretrizes para Recomendações:

1. PRIORIZAÇÃO TEMPORAL
- IMEDIATO (até 7 dias)
- CURTO PRAZO (1-3 meses)
- MÉDIO PRAZO (6 meses)
- LONGO PRAZO (anual)

2. PARA CADA RECOMENDAÇÃO
- Especifique o exame ou procedimento
- Justifique a indicação
- Indique protocolo específico quando necessário
- Defina intervalo de tempo ideal
- Considere disponibilidade no SUS/convênios

3. EXAMES COMPLEMENTARES
- Liste exames adicionais necessários
- Explique a relevância de cada um
- Indique preparos especiais necessários
- Sugira alternativas quando pertinente

4. ENCAMINHAMENTOS
- Especialidades necessárias
- Urgência do encaminhamento
- Preparos ou exames prévios necessários
- Orientações específicas para cada especialidade

5. FORMATAÇÃO
- Use tópicos claros e organizados
- Separe por categorias temporais
- Destaque recomendações urgentes
- Mantenha linguagem técnica e precisa`;

    case AIAction.ENHANCE_REPORT:
      return `<examples>${enhanceExample}</examples>

Como radiologista experiente no Brasil, aprimore este laudo em português brasileiro:

<exame>${content.split('\n')[0]}</exame>
<achados>${content}</achados>

Diretrizes para Aprimoramento:

1. TÉCNICA DO EXAME
- Parâmetros técnicos detalhados
- Protocolos específicos utilizados
- Detalhes sobre contraste/preparo
- Sequências/reconstruções especiais
- Posicionamento e incidências

2. MEDIDAS E CARACTERIZAÇÃO
- Dimensões precisas de estruturas/lesões
- Densidade/intensidade de sinal
- Padrões de realce
- Relações anatômicas
- Características específicas das lesões

3. TERMINOLOGIA ESPECIALIZADA
- Nomenclatura radiológica atual
- Classificações padronizadas
- Termos específicos da modalidade
- Descrições anatômicas precisas
- Aspectos semiológicos detalhados

4. ESTRUTURAÇÃO DO LAUDO
- Organização lógica por sistemas
- Descrição sistemática das estruturas
- Correlações anatômicas importantes
- Achados negativos relevantes
- Comparações com exames anteriores

5. IMPRESSÃO DIAGNÓSTICA
- Conclusões objetivas e diretas
- Diagnósticos diferenciais pertinentes
- Graus de certeza diagnóstica
- Recomendações específicas
- Correlações clínico-radiológicas`;

    default:
      return `<examples>${reportExample}</examples>

Você é um assistente de radiologia experiente no Brasil. Forneça respostas claras e profissionais em português brasileiro, seguindo os padrões técnicos e terminologia radiológica atual.

<exame>${content.split('\n')[0]}</exame>
<achados>${content}</achados>`;
  }
}

export function generateFallbackResponse(action: string): string {
  return "Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.";
}
