window.regionData = {

  // ============================
  // ✅ NORTH COAST REDWOODS
  // ============================
  "north-coast-redwood": {
    title: "Welcome to the North Coast Redwoods!",
    description: "Fog-dominated coastal redwood forests with massive biomass and rare but extreme fires. Stretches from Oregon to Monterey Bay.",
    fire: "Fires are infrequent but can become catastrophic during drought years due to heavy fuel loads.",
    precip: "This region receives some of the highest rainfall in California, with cool, moisture-rich marine air keeping fuels damp for most of the year. High precipitation supports dense redwood and mixed conifer forests, but also produces large amounts of biomass. Wildfires are infrequent here, but when drought years hit, the accumulated fuels can allow fires to become unusually intense.",
    veg: "Dominated by coastal redwood forests, dense understory, and heavy organic material.",
    image: "overview-images/north-redwods-overview.jpg",

    vegDetails: [
      {
        name: "Redwoods",
        label: "Highly Fire-Resistant",
        bullets: [
          "Thick bark which creates a shield to protect them",
          "Contain a large amount of tannin, a chemical that does not burn easily",
          "High water-content that prevents it from burning easily",
          "Dryer and hotter conditions increase wildfire risk and puts these forests in danger"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/redwoods.webp",
        caption: "Coast Redwood"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Started as 38 separate fires that merged together",
        "Caused by thunderstorms and spread by high winds",
        "Spread across Mendocino and Shasta forests",
        "Dense forests made the fire spread rapidly"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Burned approximately 1% of all of California, 1 million acres",
        "Took 2 months to contain",
      ],

      images: [
        { src: "case-study-images/august-complex.png", caption: "2020 August Complex" }
      ]
    }
  },

  // ============================
  // ✅ CENTRAL COAST
  // ============================
  "central-coast": {
    title: "Welcome to the Central Coast!",
    description: "Mediterranean climate with chaparral and frequent human-caused ignitions. Coast range from Sacramento-San Joaquin Rivers south to southern California Mountains; coastal strip from Monterey Bay to Santa Barbara; all of Channel Islands.",
    fire: "Frequent fast-moving brush fires driven by dry summers and offshore winds.",
    precip: "The Central Coast has moderate rainfall, heavily influenced by marine fog. The moisture limits fire spread for much of the year, but long summer dry seasons cause fast curing of coastal scrub and grasslands. As a result, fires tend to be frequent but lower-severity, driven more by winds and seasonal dryness than by long-term fuel buildup.",
    veg: "Chaparral, oak woodlands, and grasslands dominate the region.",
    image: "overview-images/central-coast.jpeg",

    vegDetails: [
      {
        name: "Oaks",
        label: "Fire-Resistant",
        bullets: [
          "Thick bark",
          "Low resin content",
          "High moisture content"
        ]
      },
      {
        name: "Pines",
        label: "Highly Flammable",
        bullets: [
          "High resin content",
          "Dry needles",
          "Ignite quickly (make good for kindling)"
        ]
      },
      {
        name: "Redwoods",
        label: "Highly Fire-Resistant",
        bullets: [
          "Thick bark which creates a shield to protect them",
          "Contain a large amount of tannin, a chemical that does not burn easily",
          "High water-content that prevents it from burning easily"
        ]
      },
      {
        name: "Eucalyptus",
        label: "Highly Flammable",
        bullets: [
          "Bark sheds which can spread the fire easily"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/ca-oaks.webp",
        caption: "California Oak"
      },
      {
        src: "veg-images/eucalyptus.webp",
        caption: "Eucalyptus Tree"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Located mostly in Big Sur",
        "Because that region is so wet in the Winter, the fire was eventually extinguished after several days of torrential rain",
        "Fire took so long to contain because the wetter forest took longer to stop burning"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Burned over 100,000 acres",
        "Took 2 months to contain",
      ],

      images: [
        { src: "case-study-images/dolan-fire.png", caption: "Firefighters" },
        { src: "case-study-images/dolan-fire-2.png", caption: "Dolan Fire 2020" }
      ]
    }
  },

  // ============================
  // ✅ NORTH COAST INTERIOR
  // ============================
  "north-coast-interior": {
    title: "Welcome to the North Coast Interior!",
    description: "Hotter inland forests with high lightning ignition potential. Runs from summit of Siskiyous south to San Francisco Bay, between coastal fog belt and Sacramento valley; isolated zone (390) on coast at Cape Mendocino.",
    fire: "High lightning ignition rates cause frequent summer wildfires.",
    precip: "Separated from coastal moisture, this interior zone receives significantly less precipitation and experiences hotter summers. Lower rainfall leads to drier forests and chaparral, increasing flammability. Fire density is typically higher than the coastal zones, as the region dries out quickly and supports fuels that ignite easily under summer heat.",
    veg: "Mixed conifer forests with dry understory fuels.",
    image: "overview-images/north-coast-int.jpg",

    vegDetails: [
      {
        name: "Oaks",
        label: "Fire Resistant",
        bullets: [
          "Thick bark",
          "Low resin content",
          "High moisture content"
        ]
      },
      {
        name: "Conifers",
        label: "Highly Flammable",
        bullets: [
          "Dry needles",
          "Contains oils and resins that often contain dead branches which can spread the fire faster"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/oak.png",
        caption: "Oak Tree"
      },
      {
        src: "veg-images/conifer-pine.png",
        caption: "Coniferous Pine"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Grew from Shasta Forest to Redding",
        "With an environment similar to North Coast Redwoods, the fire spread rapidly through dense forests",
        "Generated a powerful fire tornado with 143 mph winds, killing at least three people",
        "Fueled by extreme heat, drought conditions, steep terrain, and strong winds"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Caused a lot of infrastructure damage ($1.7 billion)",
        "Burned ~230,000 acres",
        "Took 2 months to contain",
      ],

      images: [
        { src: "case-study-images/carr-fire.png", caption: "Carr Fire 2018" },
        { src: "case-study-images/carr-fire-2.png", caption: "Carr Fire 2018" },
      ]
    }
  },

  // ============================
  // ✅ CENTRAL VALLEY
  // ============================
  "central-valley": {
    title: "Welcome to the Central Valley!",
    description: "Agricultural lowlands with fragmented fire behavior.",
    fire: "Localized agricultural and urban-interface fires.",
    precip: "Though surrounded by mountains, the valley itself receives low to moderate precipitation. Much of the landscape is agricultural, but natural grasslands cure early in the season. Fire spread tends to be fast but mostly grass-driven, with lower severity compared to forested regions—but still dangerous due to winds and open terrain.",
    veg: "Farmland, grasslands, irrigation networks.",
    image: "overview-images/central-valley.jpeg",

    vegDetails: [
      {
        name: "Valley Oaks",
        label: "Fire Resistant",
        bullets: [
          "Thick bark protects them from low-intensity fires",
          "High intensity fires can kill them"
        ]
      },
      {
        name: "Sycamores",
        label: "Fire Resistant",
        bullets: [
          "Thick bark",
          "High water content"
        ]
      },
      {
        name: "Cottonwoods",
        label: "Flammable",
        bullets: [
          "Bark is thick which can protect from low intensity fires",
          "Wood is soft which makes it burn easily",
          "Cotton seeds are highly flammable"
        ]
      },
      {
        name: "Almond Trees",
        label: "Highly Flammable",
        bullets: [
          "High oil content and resin in their wood and nuts makes them a huge risk for burning down"
        ]
      },
      {
        name: "Citrus Trees",
        label: "Fire Resistant",
        bullets: [
          "Waxy leaves helps retain moisture, making them less flammable"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/cottonwood.jpg",
        caption: "Cottonwood"
      },
      {
        src: "veg-images/almond-trees.jpg",
        caption: "Almond Trees"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Characterized by fast winds and little fuel so burned out quickly",
        "The Central Valley experiences frequent fires but few large ones due to how heavily irrigated it is"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "This fire was small (only 5000 acres)",
        "Burned for 4 days"
      ],

      images: [
        { src: "case-study-images/grant-fire.png", caption: "Firefighters during the Grant Line Fire" }
      ]
    }
  },

  // ============================
  // ✅ GREAT BASIN
  // ============================
  "great-basin": {
    title: "Welcome to the Great Basin!",
    description: "High desert grasslands with flashy fine fuels.",
    fire: "Fast-moving grass fires driven by wind.",
    precip: "This region receives very little rainfall and is dominated by shrubs and grasses. Low precipitation keeps fuels thin but consistently dry. Wildfires here often spread rapidly through fine, continuous fuels, especially in years when rare wet seasons allow grasses to proliferate and then cure.",
    veg: "Sagebrush, grasses, and desert shrubs.",
    image: "overview-images/great-basin.jpg",

    vegDetails: [
      {
        name: "Pine",
        label: "Flammable",
        bullets: [
          "Mature trees have thick bark that protects them from fires",
          "Intense fires still pose as a big risk",
          "The Bristlecone Pine, Methuseleh, found in the Great Basin is recognized as the non-clonal tree with the greatest confirmed age in the world"
        ]
      },
      {
        name: "Utah Juniper",
        label: "Highly Flammable",
        bullets: [
          "Contains oils that cause them to ignite quickly and with intensity",
          "Hold dead leaves and branches that acts are fuel for the fire"
        ]
      },
      {
        name: "Regional Climate",
        label: "Fire Risk",
        bullets: [
          "High elevation and arid environment makes this area less prone to fires",
          "High-intensity fires are still quite dangerous to vegetation"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/bristlecone-pine.webp",
        caption: "Methuseleh: Famous for being one of the oldest trees in the world at 4,856-year-old"
      },
      {
        src: "veg-images/utah-juniper.jpg",
        caption: "Utah Juniper"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Part of the issue is that the Great Basin section of California is small and so most large fires are mostly in other regions",
        "But importantly, the environment in the Great Basin is not very suitable for large fires. It's mostly shrubs and patchy growth, not large swaths of green"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "N/A"
      ],

      images: [
        { src: "case-study-images/great-basin.png", caption: "Great Basin" }
      ]
    }
  },

  // ============================
  // ✅ SOCAL DESERT
  // ============================
  "socal-desert": {
    title: "Welcome to the SoCal Desert!",
    description: "Sparse vegetation but extreme wind-driven events.",
    fire: "Fires spread explosively during Santa Ana wind events.",
    precip: "The desert receives extremely low precipitation, creating sparse but highly flammable vegetation after rare rainfall events. Fires here are often episodic—big bursts of growth after wet winters followed by extreme drying—leading to explosive, wind-driven fires when ignition occurs.",
    veg: "Joshua trees, desert shrubs, sparse grasses.",
    image: "overview-images/socal-desert.jpeg",

    vegDetails: [
      {
        name: "Joshua Tree",
        label: "Highly Flammable",
        bullets: [
          "Have not evolved fire protection due to lack of frequent desert fires"
        ]
      },
      {
        name: "California Fan Palm",
        label: "Fire Resistant",
        bullets: [
          "Vascular bundles in the tree insulates the trunks and makes them resistant to fires"
        ]
      },
      {
        name: "Regional Vegetation",
        label: "Low Fuel Load",
        bullets: [
          "Limited vegetation makes it hard to fuel large fires"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/joshua-tree.png",
        caption: "Joshua Tree"
      },
      {
        src: "veg-images/ca-fan-palm.png",
        caption: "California Fan Palm"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Ignited by a gender reveal party, the couple was ordered to pay $1,789,972 in restitution",
        "Burned mostly in San Bernardino/Riverside",
        "Was centered at the mountainous beginning of the SoCal Desert, where there's more fuel",
        "Fueled by dry grass, sagebrush, and timber, with high temperatures (around 105°F), low humidity (around 15%), and strong winds"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Burned for 2.5 months",
        "Burned 22,744 acres",
        "Cost around $42.27 million for suppression efforts"
      ],

      images: [
        { src: "case-study-images/el-dorado.png", caption: "El Dorado Fire Start" },
        { src: "case-study-images/el-dorado-2.png", caption: "Helicopter During The El Dorado Fire" }
      ]
    }
  },

  // ============================
  // ✅ SOCAL MOUNTAINS
  // ============================
  "socal-mountains": {
    title: "Welcome to the SoCal Mountains!",
    description: "Conifer forests with steep terrain and explosive fire spread. Contains most of natural conifer stands found in southern California.",
    fire: "Extreme slope-driven crown fires.",
    precip: "These mountains receive much more precipitation than the lowlands, often including winter snow. However, hot, dry summers and Santa Ana winds dry out the chaparral and forest understory. This combination of high biomass + extreme seasonal drying makes this region one of California’s most fire-prone, with both frequent and high-intensity burns.",
    veg: "Mixed pine, fir, and chaparral ecosystems.",
    image: "overview-images/socal-mountains.jpeg",

    vegDetails: [
      {
        name: "Ponderosa Pine",
        label: "Fire Resistant",
        bullets: [
          "Thick bark to protect the inside of the tree",
          "Bark is able to shed",
          "Deep roots"
        ]
      },
      {
        name: "Jeffrey Pine",
        label: "Fire Resistant",
        bullets: [
          "Thick bark insulates it from fires",
          "High moisture content",
          "Drop lower branches so it makes it harder for fires to climb up the trees"
        ]
      },
      {
        name: "Regional Climate",
        label: "Fire Risk",
        bullets: [
          "Drought has killed trees making them highly flammable",
          "Santa Ana winds accelerate fires and spread them farther"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/ponderosa-pine-2.jpg",
        caption: "Ponderosa Pine"
      },
      {
        src: "veg-images/jeffrey-pine.webp",
        caption: "Jeffrey Pine"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Fueled by large swaths of chaparral (a shrub environment native to California) in Los Angeles Forest",
        "Burned in LA county in the Santa Clarita Valley",
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Lasted 2 weeks, fires in more urban areas tend to be suppressed faster",
        "Burned over 41,000 acres",
        "Cost $29.8 million to supress"
      ],

      images: [
        { src: "case-study-images/sand-fire.png", caption: "Sand Fire 2016" },
        { src: "case-study-images/sand-fire-2.png", caption: "Sand Fire 2016" }
      ]
    }
  },

  // ============================
  // ✅ WEST-SLOPE SIERRAS
  // ============================
  "west-slope-sierra": {
    title: "Welcome to the West Slope Cascades-Sierra!",
    description: "Snow-driven fuel cycles and large fast-moving crown fires. Contains the west slope Cascades-Sierra from Oregon south to Tehachapi Mountains – bounded by Central Valley to the west and by the crest of the Cascades and Sierra Nevada to the east.",
    fire: "Heavy winter snowpack leads to massive summer fuel loads.",
    precip: "This region sees high winter precipitation, much of it as snow. Moist winters can delay the fire season, but large forests combined with warming summers create abundant, dry fuel later in the year. Lightning storms are more common here, and the combination of heavy fuels and seasonal drying contributes to high-severity fires, especially in drought years.",
    veg: "Dense conifer forests with highly flammable understory.",
    image: "overview-images/west-sierras.jpeg",

    vegDetails: [
      {
        name: "Sequoia",
        label: "Fire Resistant",
        bullets: [
          "Thick bark up to 2 feet insulates the tree from heat",
          "Canopies start high up on the tree making it hard for fires to reach the leaves",
          "Vulnerable to high-intensity fires that can reach the canopy"
        ]
      },
      {
        name: "Conifers",
        label: "Highly Flammable",
        bullets: [
          "Dry needles",
          "Contains oils and resins",
          "Often contain dead branches which can spread the fire faster"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/sequoia.webp",
        caption: "Giant Sequoia"
      },
      {
        src: "veg-images/western-hemlock.webp",
        caption: "Conifers: E.g. Western Hemlock"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Burned for 4 months",
        "First fire to be known to cross the crest of the Sierra Nevadas",
        "Mountainous region was expected to contain the fire, but once the crest was breached, it spread rapidly",
        "Large swaths of dry, dead forest caused by years of fire suppression led to the fire being so intense"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Burned nearly 1 million acres (963,309 acres)",
        "Burned for over 100 days",
        "Cost $637 million to suppress",
      ],

      images: [
        { src: "case-study-images/dixie-fire.png", caption: "Dixie Fire Map 2021" },
        { src: "case-study-images/dixie-fire-2.png", caption: "Dixie Fire 2021" },
      ]
    }
  },

  // ============================
  // ✅ EAST-SLOPE SIERRAS
  // ============================
  "east-slope-sierra": {
    title: "Welcome to the East Slope Cascades-Sierra!",
    description: "Dry rain-shadow ecosystems with wind-driven fire spread. Contains the east slope of the Cascades-Sierra from Oregon south to Walker Pass in Kern County.",
    fire: "Wind-driven fires spread rapidly through sparse dry fuels.",
    precip: "The east side of the Sierra sits in a rain shadow, resulting in much lower precipitation. Vegetation is more sparse — sagebrush, pine, and dry woodland. With limited moisture, fuels are dry for most of the year, making this region prone to fast-moving fires, especially when winds funnel down the slope.",
    veg: "Dry pine forests and shrub steppe.",
    image: "overview-images/east-sierras.jpeg",

    vegDetails: [
      {
        name: "Pine",
        label: "Flammable",
        bullets: [
          "Mature trees have thick bark that protects them from fires",
          "Intense fires still pose as a big risk"
        ]
      },
      {
        name: "Conifers",
        label: "Highly Flammable",
        bullets: [
          "Dry needles",
          "Contains oils and resins",
          "Often contain dead branches which can spread the fire faster"
        ]
      }
    ],
    vegImages: [
      {
        src: "veg-images/ponderosa-pine.jpg",
        caption: "Ponderosa Pine Tree"
      },
      {
        src: "veg-images/western-juniper.jpg",
        caption: "Conifers: E.g. Western Juniper"
      }
    ],
    caseStudy: {
      descriptionTitle: "Description",
      keyPoints: [
        "Burned for 4 months",
        "Centered in Plumas forest",
        "Started by thunderstorm",
        "Like other fires that year, unusually dry forests led to fast spreading fire",
        "Exacerbated by dense fuel and strong winds"
      ],

      statsTitle: "Fire Statistics",
      stats: [
        "Burned over 318,000 acres",
        "Destroyed over 2,300 structures, including most of the town of Berry Creek, making it one of California's deadliest and most destructive wildfires",
        "Cost $637 million to suppress",
      ],

      images: [
        { src: "case-study-images/north-complex.png", caption: "North Complex Fire 2020" }
      ]
    }
  }

};
