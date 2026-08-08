type Category = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  is_available: boolean;
};

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  is_available: boolean;
};

type ProductsTabProps = {
  categories: Category[];
  menuItems: MenuItem[];
  draftItem: ProductDraft;
  editingItemId: string | null;
  onDraftChange: (value: ProductDraft) => void;
  onSubmit: () => void;
  onEdit: (item: MenuItem) => void;
  onCancel: () => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ProductsTab({
  categories,
  menuItems,
  draftItem,
  editingItemId,
  onDraftChange,
  onSubmit,
  onEdit,
  onCancel,
  onToggleAvailability,
  onDelete,
}: ProductsTabProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Pratos</h2>
          <p className="mt-1 text-sm text-slate-400">
            Cadastre e cardápio do dia e controle disponibilidade.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Nome</label>
          <input
            value={draftItem.name}
            onChange={(event) =>
              onDraftChange({ ...draftItem, name: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder="Nome do prato"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Preço</label>
          <input
            value={draftItem.price}
            onChange={(event) =>
              onDraftChange({ ...draftItem, price: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder="0.00"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Descrição</label>
          <textarea
            value={draftItem.description}
            onChange={(event) =>
              onDraftChange({ ...draftItem, description: event.target.value })
            }
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder="Descreva o prato"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Categoria</label>
          <select
            value={draftItem.category_id}
            onChange={(event) =>
              onDraftChange({ ...draftItem, category_id: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Disponibilidade</label>
          <select
            value={draftItem.is_available ? "available" : "unavailable"}
            onChange={(event) =>
              onDraftChange({
                ...draftItem,
                is_available: event.target.value === "available",
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="available">Disponível</option>
            <option value="unavailable">Indisponível</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => void onSubmit()}
          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          {editingItemId ? "Salvar alterações" : "Adicionar prato"}
        </button>
        {editingItemId ? (
          <button
            onClick={() => void onCancel()}
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-300"
          >
            Cancelar
          </button>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {menuItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            Nenhum prato cadastrado.
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-100">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.description || "Sem descrição"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    R$ {Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void onToggleAvailability(item.id)}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                  >
                    {item.is_available ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => void onDelete(item.id)}
                    className="rounded-full border border-rose-700 px-3 py-1 text-xs text-rose-300"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
