export type SolutionTechnique = {
  title: string;
  description: string;
  materials: string;
  considerations: string;
};

export type BusinessSolution = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  lead: string;
  image: string;
  imageAlt: string;
  portfolioPattern?: string;
  problems: { title: string; signs: string; solution: string }[];
  zones: {
    title: string;
    description: string;
    techniques: SolutionTechnique[];
  }[];
  productSlugs: string[];
  brief: string[];
  process: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
};
