import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { HardDrive, Search, LayoutGrid, List } from 'lucide-react'
import productService from '../../services/productService'
import ProductGrid from '../../components/product/ProductGrid'
import ProductFilter from '../../components/product/ProductFilter'
import useDebounce from '../../hooks/useDebounce'
import SEO from '../../components/common/SEO'

/* ─────────────────────────────────────────────────────────────────────────────
 * PRODUCT SHOP
 * Browse our selection of farm-fresh dairy products.
 * ───────────────────────────────────────────────────────────────────────────── */

const ProductList = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  })

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters, debouncedSearch],
    queryFn: () => productService.getProducts({ ...filters, search: debouncedSearch }),
  })

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      <SEO 
        title="Fresh Dairy Products | GramDairy" 
        description="Browse our wide selection of fresh milk, ghee, and dairy products." 
      />

      {/* PRODUCT CATALOG HEADER */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h2 className="text-xs font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                Our Products
              </h2>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-6">
                Our Fresh <span className="text-gray-400 font-medium">Collection</span>
              </h1>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xl">
                Choose from our fresh products and start your healthy milk routine today.
              </p>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className="flex items-center gap-4 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-5 py-3 rounded-sm shadow-sm ring-1 ring-gray-900/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Products Found</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white text-right leading-none mt-1">
                    {productsData?.data?.pagination?.total || 0}
                  </span>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Categories</span>
                  <span className="text-xl font-bold text-emerald-500 text-right leading-none mt-1">
                    {categoriesData?.data?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* SIDEBAR FILTERS & MOBILE CONTROLS */}
          <aside className={`w-full lg:w-80 shrink-0 lg:sticky lg:top-28`}>
            
            {/* MOBILE SEARCH & FILTER TOGGLE (Hidden on Desktop) */}
            <div className="lg:hidden mb-12 space-y-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    defaultValue={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 pl-12 pr-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-primary-600 transition-colors"
                  />
               </div>
               <button 
                 onClick={() => setShowMobileFilters(!showMobileFilters)}
                 className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] transition-all"
               >
                 <List className="w-4 h-4" />
                 {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
               </button>
            </div>

            <div className={`${!showMobileFilters ? 'hidden lg:block' : 'block'}`}>
            
            {/* DESKTOP SEARCH (Hidden on mobile as it's at the top) */}
            <div className="hidden lg:block mb-8">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    defaultValue={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 pl-12 pr-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-primary-600 transition-colors"
                  />
               </div>
            </div>

            <ProductFilter 
              categories={categoriesData?.data}
              filters={filters}
              setFilters={setFilters}
              onSearch={setSearchTerm}
            />
            
            {/* Auxiliary Terminal Sidebar Block (DESKTOP ONLY) */}
            <div className="mt-8 p-6 bg-gray-900 text-white rounded-sm relative overflow-hidden hidden lg:block">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/20 rotate-45 -mr-12 -mt-12" />
               <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Search className="w-3.5 h-3.5" /> Need Help?
               </h4>
               <p className="text-xs text-gray-400 leading-relaxed mb-6">
                 Message us if you have any questions about our products.
               </p>
               <Link 
                 to="/support"
                 className="w-full inline-flex items-center justify-center py-3 bg-white text-gray-900 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors"
               >
                 Contact Support
               </Link>
            </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex items-center gap-4">
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Page {filters.page} of {productsData?.data?.pagination?.pages || 1}
              </p>
            </div>

            <ProductGrid 
              products={productsData?.data?.products || []} 
              isLoading={isLoading} 
            />

            {/* Pagination Logistics */}
            {productsData?.data?.pagination?.pages > 1 && (
              <div className="mt-16 flex justify-center gap-3">
                {[...Array(productsData.data.pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={`w-12 h-12 border font-bold transition-all flex items-center justify-center text-xs ${
                      filters.page === i + 1
                        ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900 shadow-xl'
                        : 'bg-white dark:bg-[#0c0c0c] border-gray-200 dark:border-gray-800 text-gray-400 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Auxiliary Terminal Sidebar Block (MOBILE ONLY - AFTER PRODUCTS) */}
        <div className="mt-16 p-8 bg-gray-900 text-white rounded-sm relative overflow-hidden lg:hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rotate-45 -mr-16 -mt-16" />
            <div className="relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  <Search className="w-4 h-4 text-primary-600" /> Need Expert Help?
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  Our team is available to assist you with choosing the right dairy products for your home.
                </p>
                <Link 
                  to="/support"
                  className="w-full inline-flex items-center justify-center py-5 bg-white text-gray-900 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-50 transition-colors"
                >
                  Contact Support Team
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
