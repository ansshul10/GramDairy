import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  const { name, slug, image, description } = category

  return (
    <Link 
      to={`/categories/${slug}`}
      className="group relative h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-xs text-gray-200 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>
    </Link>
  )
}

export default CategoryCard
