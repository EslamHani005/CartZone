import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useGetProductsQuery, useGetBrandsQuery, useGetTypesQuery } from '../services/cartZoneApi';
import { ProductCard, ProductCardSkeleton } from '../components/commerce/ProductCard';
import { Button, EmptyState } from '../components/ui';
import { SORT_OPTIONS } from '../constants';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const pageIndex = Number(params.get('pageIndex') || 1);
  const pageSize = 8;
  const brandId = params.get('brandId') ? Number(params.get('brandId')) : undefined;
  const typeId = params.get('typeId') ? Number(params.get('typeId')) : undefined;
  const sort = params.get('sort') ? Number(params.get('sort')) : undefined;
  const search = params.get('search') || undefined;

  const { data, isLoading } = useGetProductsQuery({ pageIndex, pageSize, brandId, typeId, sort, search });
  const { data: brands } = useGetBrandsQuery();
  const { data: types } = useGetTypesQuery();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key); else next.set(key, value);
    next.set('pageIndex', '1');
    setParams(next);
  }

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          {data && <p className="text-sm text-[var(--muted)] mt-1">{data.count} items found</p>}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-sand/30 dark:hover:bg-white/5 transition-colors">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            value={search || ''}
            onChange={e => setParam('search', e.target.value || null)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--card)] outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
        {/* Sort */}
        <select
          value={sort || ''}
          onChange={e => setParam('sort', e.target.value || null)}
          className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--card)] outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="">Sort by</option>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {/* Active filters */}
        {brandId && brands && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold text-xs rounded-lg">
            {brands.find(b => b.id === brandId)?.name}
            <button onClick={() => setParam('brandId', null)}><X className="w-3 h-3" /></button>
          </span>
        )}
        {typeId && types && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold text-xs rounded-lg">
            {types.find(t => t.id === typeId)?.name}
            <button onClick={() => setParam('typeId', null)}><X className="w-3 h-3" /></button>
          </span>
        )}
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="mb-6 p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Brand</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setParam('brandId', null)} className={`text-sm text-left py-1 hover:text-gold transition-colors ${!brandId ? 'text-gold font-medium' : ''}`}>All Brands</button>
              {brands?.map(b => (
                <button key={b.id} onClick={() => setParam('brandId', String(b.id))} className={`text-sm text-left py-1 hover:text-gold transition-colors ${brandId === b.id ? 'text-gold font-medium' : ''}`}>{b.name}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Type</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setParam('typeId', null)} className={`text-sm text-left py-1 hover:text-gold transition-colors ${!typeId ? 'text-gold font-medium' : ''}`}>All Types</button>
              {types?.map(t => (
                <button key={t.id} onClick={() => setParam('typeId', String(t.id))} className={`text-sm text-left py-1 hover:text-gold transition-colors ${typeId === t.id ? 'text-gold font-medium' : ''}`}>{t.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your filters or search term." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <Button variant="secondary" disabled={pageIndex === 1} onClick={() => setParam('pageIndex', String(pageIndex - 1))}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-[var(--muted)]">Page {pageIndex} of {totalPages}</span>
          <Button variant="secondary" disabled={pageIndex >= totalPages} onClick={() => setParam('pageIndex', String(pageIndex + 1))}>Next</Button>
        </div>
      )}
    </div>
  );
}
