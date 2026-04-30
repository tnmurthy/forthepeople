import { notFound } from "next/navigation";
import {
  getSuperCategoryBySlug,
  getModulesGroupedBySubGroup,
} from "@/lib/india/india-super-categories";
import { INDIA_MODULES } from "@/lib/india/india-modules";

interface PageProps {
  params: Promise<{
    locale: string;
    superCategorySlug: string;
  }>;
}

export default async function IndiaSuperCategoryPage({ params }: PageProps) {
  const { locale, superCategorySlug } = await params;

  const superCategory = getSuperCategoryBySlug(superCategorySlug);
  if (!superCategory) {
    notFound();
  }

  const groupedModules = getModulesGroupedBySubGroup(superCategorySlug, INDIA_MODULES);

  // SKELETON RENDERING — Phase 4 will replace with file 45 Section 4 styled implementation
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm text-stone-500 mb-2">
          Home / India / {superCategory.title}
        </div>
        <h1 className="text-4xl font-medium tracking-tight mb-2">
          {superCategory.icon} {superCategory.title}
        </h1>
        <p className="text-stone-600 mb-8">{superCategory.tagline}</p>

        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-3 border-r border-stone-200 pr-6">
            {Array.from(groupedModules.entries()).map(([groupLabel, modules]) => (
              <div key={groupLabel} className="mb-6">
                {groupLabel !== "UNGROUPED" && (
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-2">
                    {groupLabel}
                  </div>
                )}
                <ul className="space-y-1">
                  {modules.map((mod) => (
                    <li key={mod.slug}>
                      <a
                        href={`/${locale}/india/${mod.slug}`}
                        className="text-sm text-stone-700 hover:text-stone-900 block py-1"
                      >
                        {mod.icon} {mod.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <main className="col-span-9">
            <div className="border border-stone-200 rounded-lg p-8 bg-white">
              <p className="text-stone-500 text-sm">
                Module content rendering will be implemented in Phase 4.
              </p>
              <p className="text-stone-400 text-xs mt-4">
                {Array.from(groupedModules.entries()).reduce(
                  (sum, [, m]) => sum + m.length,
                  0,
                )}{" "}
                modules registered for this super-category.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
