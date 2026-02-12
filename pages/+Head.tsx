export function Head() {
  const siteTitle = 'RYNX — Full-Stack Developer | React & TypeScript';
  const socialLinks = [
    'https://github.com/rennixx',
    'https://x.com/vrynyx',
  ];
  const address = {
    '@type': 'PostalAddress' as const,
    addressLocality: 'Erbil',
    addressRegion: 'Kurdistan',
    addressCountry: 'Iraq',
  };

  return (
    <>
      {/* Primary SEO Meta Tags */}
      <meta
        name="description"
        content="RYNX — Full-Stack Developer specialising in React, TypeScript & Node.js. Explore selected projects, skills, and get in touch."
      />
      <meta
        name="keywords"
        content="Full-Stack Developer, React Developer, TypeScript Developer, Node.js Developer, Software Engineer, Web Developer, Frontend Developer, Backend Developer, Erbil Developer, Kurdistan Developer, JavaScript Developer, Web Development, Software Development, Web Applications, API Development"
      />
      <meta name="author" content="RYNX" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      {/* Open Graph Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta
        property="og:description"
        content="Explore projects, skills, and experience from a developer who specialises in React, TypeScript, and Node.js."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rynx.dev" />
      <meta property="og:site_name" content="RYNX Portfolio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="https://rynx.dev/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteTitle} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta
        name="twitter:description"
        content="Selected projects and skills from a React & TypeScript developer based in Erbil."
      />
      <meta name="twitter:site" content="@vrynyx" />
      <meta name="twitter:creator" content="@vrynyx" />
      <meta name="twitter:image" content="https://rynx.dev/og-image.png" />
      <meta name="twitter:image:alt" content={siteTitle} />

      {/* Preconnect hints */}
      <link rel="preconnect" href="https://api.github.com" />
      <link rel="preconnect" href="https://opengraph.githubassets.com" />

      {/* Additional SEO */}
      <link rel="canonical" href="https://rynx.dev" />
      <meta name="theme-color" content="#000000" />
      <meta name="color-scheme" content="dark" />

      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'RYNX',
            alternateName: 'Ren',
            jobTitle: 'Full-Stack Developer',
            description:
              'Full-Stack Developer specialising in React, TypeScript, and Node.js — building fast, accessible web applications.',
            url: 'https://rynx.dev',
            image: 'https://rynx.dev/profile-image.jpg',
            sameAs: socialLinks,
            knowsAbout: [
              'React',
              'TypeScript',
              'Node.js',
              'Full-Stack Web Development',
              'API Development',
              'Software Architecture',
              'Web Performance',
            ],
            worksFor: {
              '@type': 'Organization',
              name: 'Freelance',
            },
            address,
            hasOccupation: {
              '@type': 'Occupation',
              name: 'Software Developer',
              occupationLocation: {
                '@type': 'Place',
                name: 'Erbil, Kurdistan',
              },
            },
          }),
        }}
      />

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'RYNX Development',
            url: 'https://rynx.dev',
            logo: 'https://rynx.dev/logo.png',
            description:
              'Web development services — React, TypeScript, and Node.js applications for clients worldwide.',
            address,
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: 'contact@rynx.dev',
            },
            sameAs: socialLinks,
            areaServed: [
              { '@type': 'Place', name: 'Erbil, Kurdistan' },
              { '@type': 'Place', name: 'Worldwide' },
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Web Development Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Full-Stack Web Development',
                    description:
                      'End-to-end web applications using React, TypeScript, and Node.js',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'API & Backend Development',
                    description:
                      'RESTful APIs and backend services built on Node.js',
                  },
                },
              ],
            },
          }),
        }}
      />
    </>
  )
}
