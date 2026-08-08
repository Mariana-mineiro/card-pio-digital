type Category = {
  id: string;
  name: string;
};

type CategoriesTabProps = {
  categories: Category[];
  draftCategory: string;
  onDraftChange: (value: string) => void;
  onCreateCategory: () => void;
};

export function CategoriesTab({
  categories,
  draftCategory,
  onDraftChange,
  onCreateCategory,
}: CategoriesTabProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Categorias</h2>
          <p className="mt-1 text-sm text-slate-400">
            Organize o cardápio por seções.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={draftCategory}
          onChange={(event) => onDraftChange(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          placeholder="Nova categoria"
        />
        <button
          onClick={() => void onCreateCategory()}
          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          Criar
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
            >
              {category.name}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
