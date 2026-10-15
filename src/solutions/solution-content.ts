import { solutionsA } from "./solutions-a";
import { solutionsB } from "./solutions-b";

export const businessSolutions = [...solutionsA, ...solutionsB];
export function getBusinessSolution(slug: string) {
  return businessSolutions.find((solution) => solution.slug === slug);
}
