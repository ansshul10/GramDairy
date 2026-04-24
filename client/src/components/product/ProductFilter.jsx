import { Search, SlidersHorizontal, X, Target, BarChart, HardDrive } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE LOGISTICS FILTER TERMINAL
 * A rigid, static, and highly professional filtering interface.
 * Features strict vertical separators and dense typographic controls.
 * ───────────────────────────────────────────────────────────────────────────── */

const ProductFilter = ({ 
  categories, 
  filters, 
  setFilters, 
  onSearch 
}) => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-200 dark:border-gray-800 space-y-10">
      
      {/* 2. CATEGORY SELECTION */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-primary-600" /> Product Categories
        </label>
        <div className="flex flex-col border border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-[#0c0c0c] rounded-sm overflow-hidden">
          <button
            onClick={() => setFilters({ ...filters, category: '' })}
            className={`text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-l-2 ${
              !filters.category 
                ? 'bg-white dark:bg-[#111111] text-primary-600 border-primary-600 shadow-sm' 
                : 'text-gray-500 border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            All Products
          </button>
          
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilters({ ...filters, category: cat._id })}
              className={`text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-l-2 ${
                filters.category === cat._id 
                  ? 'bg-white dark:bg-[#111111] text-primary-600 border-primary-600 shadow-sm' 
                  : 'text-gray-500 border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PROCUREMENT PRICE THRESHOLD */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Price Range (₹)</label>
        <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-[#0a0a0a] p-3">
            <input
              type="number"
              placeholder="MIN"
              className="w-full bg-transparent text-[11px] font-bold uppercase outline-none text-gray-900 dark:text-white placeholder:text-gray-300"
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] p-3">
            <input
              type="number"
              placeholder="MAX"
              className="w-full bg-transparent text-[11px] font-bold uppercase outline-none text-gray-900 dark:text-white placeholder:text-gray-300"
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 4. DATA SORTING PROTOCOL */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <BarChart className="w-3.5 h-3.5 text-primary-600" /> Sort By
        </label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm text-[11px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-primary-600 text-gray-900 dark:text-white"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Ascending</option>
            <option value="price_desc">Price: Descending</option>
            <option value="rating">Top Rated</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Target className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 5. RESET COMMAND */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-gray-100 dark:border-gray-800"
        >
          <X className="w-4 h-4" /> Clear Filters
        </button>
      </div>
    </div>
  )
}

export default ProductFilter
