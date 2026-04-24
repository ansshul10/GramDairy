import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  name = 'GramDairy', 
  type = 'website',
  image = '/pwa-512x512.png',
  url = window.location.href,
  price,
  rating
}) => {
  const fullTitle = title ? `${title} | ${name}` : name;
  const defaultDescription = description || 'Premium Farm Fresh Dairy Delivery. Pure, fresh, and delivered to your doorstep every morning.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={defaultDescription} />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "description": defaultDescription,
            "image": image,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": price,
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": rating ? {
              "@type": "AggregateRating",
              "ratingValue": rating,
              "reviewCount": "1"
            } : undefined
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
