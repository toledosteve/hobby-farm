import type { MapInsight, MapLayer, MapMode } from "./types";

export const getMockInsights = (mode: MapMode): MapInsight[] => {
  switch (mode) {
    case 'land-suitability':
      return [
        {
          id: 'soil-drainage-1',
          title: 'Mixed Drainage Patterns',
          description:
            'Your property contains both well-drained upland areas and moderately poorly-drained lower sections.',
          impact:
            'Well-drained areas are ideal for fruit trees and root vegetables. Lower areas may experience seasonal wetness affecting certain crops.',
          suggestions: [
            'Use upland areas for orchards and gardens',
            'Consider raised beds in lower sections',
            'Plant water-tolerant species in wet zones',
          ],
          severity: 'info',
          relatedModules: ['Orchard', 'Trees', 'Planning'],
        },
        {
          id: 'soil-runoff-1',
          title: 'High Runoff Potential Zone',
          description:
            'The eastern slope contains Group D soils with high runoff potential due to clay content and 8% slope.',
          impact:
            'Increased surface runoff can affect orchard root health, create muddy poultry areas, and carry nutrients off-site.',
          suggestions: [
            'Install buffer plantings along slope',
            'Use contour planting for orchards',
            'Avoid placing coops in runoff path',
            'Consider swales or terracing',
          ],
          severity: 'notice',
          relatedModules: ['Orchard', 'Poultry'],
        },
        {
          id: 'prime-farmland-1',
          title: 'Prime Farmland Identified',
          description:
            '12 acres of your property is classified as prime farmland with loam soils, good drainage, and minimal slope.',
          impact:
            'These areas are ideal for intensive agriculture and will support a wide range of crops with minimal amendments.',
          suggestions: [
            'Prioritize this area for main gardens and orchards',
            'Track soil health over time',
            'Maintain organic matter through cover crops',
          ],
          severity: 'info',
          relatedModules: ['Planning', 'Orchard'],
        },
      ];

    case 'trees-orchard':
      return [
        {
          id: 'frost-pocket-1',
          title: 'Frost Pocket Detected',
          description:
            '3 planned apple trees fall within a known frost pocket where cold air settles on clear nights.',
          impact:
            'Late spring frosts can damage blossoms, reducing fruit set by 30-70%. This is especially risky for early-blooming varieties.',
          suggestions: [
            'Choose late-blooming varieties for this area',
            'Relocate trees to higher ground',
            'Plan for frost protection (wind machines, smudge pots)',
            'Consider cold-hardy species instead',
          ],
          severity: 'important',
          relatedModules: ['Orchard', 'Weather'],
        },
        {
          id: 'soil-compatibility-1',
          title: 'Excellent Soil Match',
          description:
            'Your Honeycrisp apple trees are planted in well-drained loam with pH 6.2—ideal conditions for apples.',
          impact:
            'Trees should establish quickly with good root development and minimal disease pressure.',
          suggestions: [
            'Maintain current soil pH with periodic testing',
            'Add 2-3 inches of mulch around root zones',
            'Monitor for good drainage after heavy rain',
          ],
          severity: 'info',
          relatedModules: ['Orchard'],
        },
        {
          id: 'spacing-warning-1',
          title: 'Root Zone Overlap',
          description:
            'Two mature pear trees have overlapping root zones based on their expected size at maturity.',
          impact:
            'Root competition can reduce tree vigor and fruit production. Water and nutrient uptake may be limited.',
          suggestions: [
            'Provide supplemental water during dry periods',
            'Increase fertilization slightly',
            'Consider removing one tree if growth is stunted',
            'Plan better spacing for future plantings',
          ],
          severity: 'notice',
          relatedModules: ['Orchard'],
        },
      ];

    case 'poultry-livestock':
      return [
        {
          id: 'heat-stress-1',
          title: 'Limited Shade Coverage',
          description:
            'The southern pasture has only 30% shade coverage during peak summer sun (12pm-4pm).',
          impact:
            'Chickens can experience heat stress in temperatures above 85°F, leading to reduced egg production and health issues.',
          suggestions: [
            'Add shade structures (tarps, shade cloth)',
            'Plant fast-growing shade trees along southern edge',
            'Provide multiple water stations',
            'Consider rotating to shaded areas during hot months',
          ],
          severity: 'notice',
          relatedModules: ['Poultry', 'Trees'],
        },
        {
          id: 'mud-accumulation-1',
          title: 'Mud Accumulation Risk',
          description:
            'The coop is located in a slight depression where water naturally collects during rain events.',
          impact:
            'Muddy conditions increase disease risk (bumblefoot), reduce foraging quality, and make management difficult.',
          suggestions: [
            'Relocate coop to higher, well-drained area',
            'Add French drain to redirect water',
            'Use deep bedding or wood chips for mud control',
            'Grade area to improve drainage',
          ],
          severity: 'important',
          relatedModules: ['Poultry'],
        },
        {
          id: 'rotation-path-1',
          title: 'Good Rotation Potential',
          description:
            'Three connected pasture areas allow for rotational grazing with natural barriers.',
          impact:
            'Rotation reduces parasite load, maintains pasture quality, and mimics natural foraging behavior.',
          suggestions: [
            'Rotate every 2-3 weeks during growing season',
            'Allow 4-6 weeks rest between rotations',
            'Monitor pasture recovery and adjust timing',
            'Track egg production by pasture area',
          ],
          severity: 'info',
          relatedModules: ['Poultry', 'Planning'],
        },
      ];

    case 'pollination-bees':
      return [
        {
          id: 'coverage-gap-1',
          title: 'Pollination Coverage Gap',
          description:
            'Your northern orchard section (4 trees) falls outside the optimal foraging range of existing hives.',
          impact:
            'Trees may experience reduced pollination, leading to lower fruit set and smaller yields.',
          suggestions: [
            'Add a hive closer to northern section',
            'Plant pollinator-attracting flowers nearby',
            'Consider hand pollination for these trees',
            'Monitor fruit set compared to other areas',
          ],
          severity: 'notice',
          relatedModules: ['Beekeeping', 'Orchard'],
        },
        {
          id: 'bloom-timing-1',
          title: 'Excellent Bloom Overlap',
          description:
            'Your apple, pear, and cherry trees have overlapping bloom periods (April 20-May 10) within hive range.',
          impact:
            'Good bloom timing and proximity means strong cross-pollination potential and higher fruit set.',
          suggestions: [
            'Monitor bee activity during bloom',
            'Avoid pesticide use during bloom period',
            'Ensure hives are strong going into spring',
            'Track fruit set to measure pollination success',
          ],
          severity: 'info',
          relatedModules: ['Beekeeping', 'Orchard'],
        },
        {
          id: 'wind-exposure-1',
          title: 'Hive Wind Exposure',
          description:
            'Hive B is exposed to prevailing northwest winds with no natural windbreak.',
          impact:
            'Wind stress can reduce foraging activity, increase hive energy needs, and make inspections difficult.',
          suggestions: [
            'Plant evergreen windbreak on northwest side',
            'Rotate hive entrance away from wind',
            'Add temporary wind barrier (fence, bales)',
            'Monitor colony strength vs. protected hives',
          ],
          severity: 'notice',
          relatedModules: ['Beekeeping', 'Trees'],
        },
      ];

    case 'weather-water':
      return [
        {
          id: 'frost-pocket-weather-1',
          title: 'Cold Air Drainage Pattern',
          description:
            'Cold air naturally flows downhill and pools in the low-lying southeast corner on clear, calm nights.',
          impact:
            'This area can be 5-10°F colder than surrounding areas, increasing frost risk for sensitive crops and late blooms.',
          suggestions: [
            'Avoid planting frost-sensitive crops here',
            'Use this area for cold-hardy species',
            'Monitor with min/max thermometer',
            'Consider this for cold storage or root cellaring',
          ],
          severity: 'info',
          relatedModules: ['Orchard', 'Planning'],
        },
        {
          id: 'standing-water-1',
          title: 'Seasonal Standing Water',
          description:
            'The western low area shows evidence of standing water in spring (March-April) based on soil indicators.',
          impact:
            'Seasonal saturation limits planting options and can create muddy access issues during wet periods.',
          suggestions: [
            'Use for wildlife habitat or pollinator meadow',
            'Install drainage if needed for access',
            'Plant water-loving species (willows, alders)',
            'Avoid this area for structures or orchards',
          ],
          severity: 'notice',
          relatedModules: ['Planning', 'Trees'],
        },
        {
          id: 'wind-corridor-1',
          title: 'Wind Corridor Identified',
          description:
            'Gap in tree line creates a natural wind tunnel with increased wind speeds from the west.',
          impact:
            'Higher winds can damage fruit tree branches, reduce bee foraging activity, and increase water stress.',
          suggestions: [
            'Plant windbreak trees to fill gap',
            'Stake young trees securely',
            'Use this for wind-tolerant species',
            'Consider wind energy potential',
          ],
          severity: 'info',
          relatedModules: ['Trees', 'Beekeeping', 'Orchard'],
        },
      ];

    case 'planning':
      return [
        {
          id: 'planning-conflict-1',
          title: 'Marginal Drainage for Planned Orchard',
          description:
            '3 of your planned orchard trees fall into a zone with somewhat poorly-drained soils.',
          impact:
            'Fruit trees generally prefer well-drained soils. Poor drainage increases disease risk and limits root development.',
          suggestions: [
            'Shift trees 20-30 feet upslope',
            'Use raised planting mounds',
            'Choose disease-resistant rootstocks',
            'Install subsurface drainage',
          ],
          severity: 'important',
          relatedModules: ['Orchard', 'Planning'],
        },
        {
          id: 'planning-synergy-1',
          title: 'Great Pollination Setup',
          description:
            'Your planned hive location provides excellent coverage for both the existing orchard and planned garden areas.',
          impact:
            'Centralized pollinator support increases yields across multiple crops and reduces need for multiple hive locations.',
          suggestions: [
            'Proceed with planned hive placement',
            'Add pollinator-attracting plants nearby',
            'Plan for water source within 100 feet',
            'Ensure flight path avoids high-traffic areas',
          ],
          severity: 'info',
          relatedModules: ['Beekeeping', 'Orchard', 'Planning'],
        },
        {
          id: 'planning-access-1',
          title: 'Seasonal Access Challenge',
          description:
            'Planned infrastructure crosses an area that shows spring wetness, which may limit tractor/vehicle access.',
          impact:
            'Muddy conditions can delay spring work, limit equipment use, and create maintenance issues.',
          suggestions: [
            'Reroute path to higher, drier ground',
            'Plan for gravel or improved surface',
            'Schedule work for drier months',
            'Consider this for foot-traffic only',
          ],
          severity: 'notice',
          relatedModules: ['Planning'],
        },
      ];

    default:
      return [];
  }
};

export const getMockLayers = (mode: MapMode): MapLayer[] => {
  const baseLayers: MapLayer[] = [
    {
      id: 'property-boundary',
      name: 'Property Boundary',
      enabled: true,
      category: 'data',
      opacity: 100,
    },
  ];

  const modeLayers: Record<MapMode, MapLayer[]> = {
    'land-suitability': [
      {
        id: 'soil-types',
        name: 'Soil Types',
        enabled: true,
        category: 'data',
        mapMode: 'land-suitability',
        opacity: 70,
      },
      {
        id: 'drainage-class',
        name: 'Drainage Class',
        enabled: false,
        category: 'data',
        mapMode: 'land-suitability',
        opacity: 60,
      },
      {
        id: 'slope-map',
        name: 'Slope & Aspect',
        enabled: false,
        category: 'data',
        mapMode: 'land-suitability',
        opacity: 50,
      },
      {
        id: 'runoff-potential',
        name: 'Runoff Potential',
        enabled: true,
        category: 'data',
        mapMode: 'land-suitability',
        opacity: 60,
      },
      {
        id: 'prime-farmland',
        name: 'Prime Farmland',
        enabled: false,
        category: 'data',
        mapMode: 'land-suitability',
        opacity: 50,
      },
    ],

    'trees-orchard': [
      {
        id: 'existing-trees',
        name: 'Existing Trees',
        enabled: true,
        category: 'module',
        mapMode: 'trees-orchard',
        opacity: 100,
      },
      {
        id: 'root-zones',
        name: 'Root Zone Extents',
        enabled: true,
        category: 'module',
        mapMode: 'trees-orchard',
        opacity: 40,
      },
      {
        id: 'frost-pockets',
        name: 'Frost Risk Zones',
        enabled: true,
        category: 'data',
        mapMode: 'trees-orchard',
        opacity: 50,
      },
      {
        id: 'soil-compatibility',
        name: 'Soil Compatibility',
        enabled: false,
        category: 'data',
        mapMode: 'trees-orchard',
        opacity: 60,
      },
    ],

    'poultry-livestock': [
      {
        id: 'coop-locations',
        name: 'Coop Locations',
        enabled: true,
        category: 'module',
        mapMode: 'poultry-livestock',
        opacity: 100,
      },
      {
        id: 'pasture-zones',
        name: 'Pasture Zones',
        enabled: true,
        category: 'module',
        mapMode: 'poultry-livestock',
        opacity: 50,
      },
      {
        id: 'shade-coverage',
        name: 'Shade Coverage',
        enabled: true,
        category: 'data',
        mapMode: 'poultry-livestock',
        opacity: 40,
      },
      {
        id: 'runoff-paths',
        name: 'Water Runoff Paths',
        enabled: false,
        category: 'data',
        mapMode: 'poultry-livestock',
        opacity: 60,
      },
    ],

    'pollination-bees': [
      {
        id: 'hive-locations',
        name: 'Hive Locations',
        enabled: true,
        category: 'module',
        mapMode: 'pollination-bees',
        opacity: 100,
      },
      {
        id: 'foraging-radius',
        name: 'Foraging Range (optimal)',
        enabled: true,
        category: 'module',
        mapMode: 'pollination-bees',
        opacity: 30,
      },
      {
        id: 'bloom-zones',
        name: 'Current Bloom Zones',
        enabled: true,
        category: 'data',
        mapMode: 'pollination-bees',
        opacity: 50,
      },
      {
        id: 'wind-exposure',
        name: 'Wind Exposure',
        enabled: false,
        category: 'data',
        mapMode: 'pollination-bees',
        opacity: 40,
      },
    ],

    'weather-water': [
      {
        id: 'frost-pockets-weather',
        name: 'Frost Pockets',
        enabled: true,
        category: 'data',
        mapMode: 'weather-water',
        opacity: 60,
      },
      {
        id: 'cold-air-flow',
        name: 'Cold Air Drainage',
        enabled: false,
        category: 'data',
        mapMode: 'weather-water',
        opacity: 50,
      },
      {
        id: 'standing-water',
        name: 'Standing Water Risk',
        enabled: true,
        category: 'data',
        mapMode: 'weather-water',
        opacity: 60,
      },
      {
        id: 'wind-corridors',
        name: 'Wind Corridors',
        enabled: false,
        category: 'data',
        mapMode: 'weather-water',
        opacity: 40,
      },
    ],

    'planning': [
      {
        id: 'planned-orchards',
        name: 'Planned Orchards',
        enabled: true,
        category: 'planning',
        mapMode: 'planning',
        opacity: 70,
      },
      {
        id: 'planned-infrastructure',
        name: 'Planned Infrastructure',
        enabled: true,
        category: 'planning',
        mapMode: 'planning',
        opacity: 80,
      },
      {
        id: 'future-zones',
        name: 'Future Development Zones',
        enabled: false,
        category: 'planning',
        mapMode: 'planning',
        opacity: 50,
      },
      {
        id: 'suitability-overlay',
        name: 'Land Suitability',
        enabled: true,
        category: 'data',
        mapMode: 'planning',
        opacity: 40,
      },
    ],
  };

  return [...baseLayers, ...(modeLayers[mode] || [])];
};