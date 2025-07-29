export interface FormattedDescription {
  title: string;
  subtitle: string;
  features: string[];
  benefits: string[];
  details: string;
  tips: string[];
}

export function formatProductDescription(
  description: string,
  productName: string
): FormattedDescription {
  // Extrair características baseadas no nome e descrição
  const features = extractFeatures(description, productName);
  const benefits = extractBenefits(description, productName);
  const tips = generateTips(productName);

  // Gerar título e subtítulo baseados no tipo de produto
  const { title, subtitle } = generateTitleAndSubtitle(productName);

  return {
    title,
    subtitle,
    features,
    benefits,
    details: description,
    tips,
  };
}

function extractFeatures(description: string, productName: string): string[] {
  const features: string[] = [];
  const name = productName.toLowerCase();
  const desc = description.toLowerCase();

  // Características baseadas no nome do produto
  if (
    name.includes("discreto") ||
    name.includes("mini") ||
    desc.includes("discreto")
  ) {
    features.push("Design discreto e portátil");
  }

  if (name.includes("silencioso") || desc.includes("silencioso")) {
    features.push("Operação silenciosa para total discrição");
  }

  if (name.includes("app") || desc.includes("aplicativo")) {
    features.push("Controle via aplicativo");
  }

  if (name.includes("curvado") || desc.includes("curvado")) {
    features.push("Design curvado para máxima precisão");
  }

  if (name.includes("duplo") || desc.includes("duplo")) {
    features.push("Estimulação dupla");
  }

  if (name.includes("pulsador") || desc.includes("pulsação")) {
    features.push("Tecnologia de pulsação rítmica");
  }

  if (name.includes("gel") || desc.includes("lubrificante")) {
    features.push("Fórmula hipoalergênica e segura");
  }

  // Características padrão
  features.push("Material seguro e hipoalergênico");
  features.push("Fácil limpeza e manutenção");

  if (features.length < 3) {
    features.push("Múltiplas velocidades personalizáveis");
    features.push("Design ergonômico para máximo conforto");
  }

  return features.slice(0, 5); // Máximo 5 características
}

function extractBenefits(description: string, productName: string): string[] {
  const benefits: string[] = [];
  const name = productName.toLowerCase();
  const desc = description.toLowerCase();

  // Benefícios baseados no tipo de produto
  if (name.includes("massageador") || desc.includes("massagem")) {
    benefits.push("Promove relaxamento muscular");
    benefits.push("Alivia tensões e estresse");
  }

  if (name.includes("estimulador") || desc.includes("estimulação")) {
    benefits.push("Estimulação precisa e intensa");
    benefits.push("Ideal para explorar novas sensações");
  }

  if (name.includes("simulador") || desc.includes("simulação")) {
    benefits.push("Experiência realista e natural");
    benefits.push("Simula o toque humano");
  }

  if (name.includes("gel") || desc.includes("lubrificante")) {
    benefits.push("Aumenta o conforto durante o uso");
    benefits.push("Intensifica as sensações de prazer");
  }

  if (name.includes("anel") || desc.includes("casal")) {
    benefits.push("Intensifica os momentos a dois");
    benefits.push("Fortalece a intimidade do casal");
  }

  // Benefícios padrão
  benefits.push("Promove autoconhecimento");
  benefits.push("Ajuda a conhecer melhor suas preferências");

  return benefits.slice(0, 5); // Máximo 5 benefícios
}

function generateTips(productName: string): string[] {
  const name = productName.toLowerCase();
  const tips: string[] = [];

  // Dicas específicas baseadas no tipo de produto
  if (name.includes("gel") || name.includes("lubrificante")) {
    tips.push("Aplique uma quantidade generosa para maior conforto");
    tips.push("Reaplique conforme necessário durante o uso");
    tips.push("Teste em uma pequena área da pele primeiro");
  } else {
    tips.push("Use lubrificante à base d'água para maior conforto");
    tips.push("Comece com intensidade baixa e aumente gradualmente");
    tips.push("Limpe sempre após o uso com sabão neutro");
  }

  tips.push("Armazene em local seco e discreto");
  tips.push("Reserve um momento tranquilo para sua experiência");

  return tips;
}

function generateTitleAndSubtitle(productName: string): {
  title: string;
  subtitle: string;
} {
  const name = productName.toLowerCase();

  if (name.includes("simulador")) {
    return {
      title: "Simulação Realista e Intensa",
      subtitle: "Tecnologia avançada para experiências únicas",
    };
  }

  if (name.includes("massageador")) {
    return {
      title: "Relaxamento e Prazer em Harmonia",
      subtitle: "Massageadores para momentos de autocuidado",
    };
  }

  if (name.includes("estimulador")) {
    return {
      title: "Estimulação Precisa e Intensa",
      subtitle: "Tecnologia inovadora para novas sensações",
    };
  }

  if (name.includes("pulsador")) {
    return {
      title: "Pulsação Rítmica e Elegante",
      subtitle: "Sinta cada momento com intensidade",
    };
  }

  if (name.includes("gel") || name.includes("lubrificante")) {
    return {
      title: "Conforto e Prazer em Harmonia",
      subtitle: "Lubrificantes de alta qualidade",
    };
  }

  if (name.includes("anel")) {
    return {
      title: "Intensifique a Conexão do Casal",
      subtitle: "Produtos selecionados para momentos especiais",
    };
  }

  // Padrão
  return {
    title: "Descubra o Prazer em Sua Essência",
    subtitle: "Tecnologia avançada para momentos inesquecíveis",
  };
}
