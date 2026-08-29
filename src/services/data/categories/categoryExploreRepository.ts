import type { CategoryDetailBundle, CategoryExploreItem, QuizSortMode } from '@app-types/categoryExplore.types';
import { fetchNestCategories, fetchNestCategoryDetail } from './nestCategoriesClient';

/** Catalogue catégories / quiz : Nest uniquement (plus de PostgREST). */
export async function fetchCategoriesWithQuizCounts(): Promise<CategoryExploreItem[]> {
  return fetchNestCategories();
}

export async function fetchCategoryDetailBySlug(
  slug: string,
  sort: QuizSortMode,
): Promise<CategoryDetailBundle | null> {
  return fetchNestCategoryDetail(slug, sort);
}
