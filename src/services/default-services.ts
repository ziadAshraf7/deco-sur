import { ServiceType } from '@prisma/client';

export type LocalizedServiceCopy = {
  title: string;
  excerpt: string;
  description: string;
};

export type DefaultService = {
  type: ServiceType;
  slug: string;
  sortOrder: number;
  en: LocalizedServiceCopy;
  fr: LocalizedServiceCopy;
};

export const DEFAULT_SERVICES: DefaultService[] = [
  {
    type: ServiceType.FLOORING,
    slug: 'flooring',
    sortOrder: 1,
    en: {
      title: 'Flooring',
      excerpt: 'Durable, well-detailed floors that set the tone of every room.',
      description:
        'We specify and install flooring that matches how the space is actually used — from high-traffic commercial areas to quiet residential rooms. Materials, transitions, and finishes are coordinated with the rest of the interior so the floor reads as part of the architecture, not an afterthought.',
    },
    fr: {
      title: 'Revêtement de sol',
      excerpt: 'Des sols durables et bien détaillés qui donnent le ton à chaque pièce.',
      description:
        'Nous spécifions et posons des revêtements adaptés à l’usage réel de l’espace — des zones commerciales très fréquentées aux pièces résidentielles plus calmes. Matériaux, raccords et finitions sont coordonnés avec le reste de l’intérieur pour que le sol fasse partie de l’architecture, et non un ajout tardif.',
    },
  },
  {
    type: ServiceType.PAINTING,
    slug: 'painting',
    sortOrder: 2,
    en: {
      title: 'Painting',
      excerpt: 'Color, sheen, and surface prep that hold up in real light.',
      description:
        'Painting is treated as a finish system: substrate repair, primers, sheen selection, and color that works with lighting and materials already in the space. We handle walls, ceilings, millwork, and feature surfaces with a consistent, site-ready standard.',
    },
    fr: {
      title: 'Peinture',
      excerpt: 'Couleur, brillance et préparation de surface qui tiennent à la lumière réelle.',
      description:
        'La peinture est traitée comme un système de finition : réparation du support, primaires, choix du brillant et couleur en accord avec l’éclairage et les matériaux déjà présents. Nous intervenons sur murs, plafonds, menuiseries et surfaces d’exception avec un standard de chantier homogène.',
    },
  },
  {
    type: ServiceType.GYPSUM,
    slug: 'gypsum',
    sortOrder: 3,
    en: {
      title: 'Gypsum',
      excerpt: 'Partitions, niches, and drywall work built for clean lines.',
      description:
        'Gypsum work covers partitions, bulkheads, concealed services, and custom niches. Details are planned so lighting, joinery, and openings land cleanly — with attention to joints, corners, and the surfaces that will receive paint or cladding.',
    },
    fr: {
      title: 'Plâtre et cloisons',
      excerpt: 'Cloisons, niches et travaux de placo conçus pour des lignes nettes.',
      description:
        'Les travaux de plâtre couvrent cloisons, faux volumes, réseaux dissimulés et niches sur mesure. Les détails sont pensés pour que l’éclairage, la menuiserie et les ouvertures s’alignent proprement — joints, angles et surfaces destinées à la peinture ou au revêtement compris.',
    },
  },
  {
    type: ServiceType.CEILINGS,
    slug: 'ceilings',
    sortOrder: 4,
    en: {
      title: 'Ceilings',
      excerpt: 'Ceiling planes that hide services and shape the room.',
      description:
        'Ceiling design is coordinated with HVAC, lighting, and acoustics. We build gypsum, suspended, and feature ceilings that keep services accessible where needed and present a calm, continuous plane where the room should feel finished.',
    },
    fr: {
      title: 'Plafonds',
      excerpt: 'Des plans de plafond qui masquent les réseaux et sculptent la pièce.',
      description:
        'Le plafond est coordonné avec la CVC, l’éclairage et l’acoustique. Nous réalisons des plafonds en plâtre, suspendus ou d’exception, accessibles là où les réseaux l’exigent, et calmes et continus là où la pièce doit paraître achevée.',
    },
  },
  {
    type: ServiceType.WALLS,
    slug: 'walls',
    sortOrder: 5,
    en: {
      title: 'Walls',
      excerpt: 'Cladding, finishes, and wall compositions with real depth.',
      description:
        'Walls are more than paint. We deliver panelling, feature cladding, texture, and integrated storage or display — detailed so junctions with floors, ceilings, and openings stay crisp after installation.',
    },
    fr: {
      title: 'Murs',
      excerpt: 'Revêtements, finitions et compositions murales avec du relief.',
      description:
        'Un mur, ce n’est pas seulement de la peinture. Nous réalisons lambris, revêtements d’exception, textures et rangements ou présentoirs intégrés — détaillés pour que les raccords avec sols, plafonds et ouvertures restent nets après pose.',
    },
  },
  {
    type: ServiceType.LIGHTING,
    slug: 'lighting',
    sortOrder: 6,
    en: {
      title: 'Lighting',
      excerpt: 'Layered light that supports both atmosphere and function.',
      description:
        'Lighting is specified as a complete layer: ambient, task, and accent, tied to ceiling and joinery details. We coordinate fixtures, switching, and dimming so the space works in day and night without last-minute compromises.',
    },
    fr: {
      title: 'Éclairage',
      excerpt: 'Une lumière en couches, à la fois d’ambiance et fonctionnelle.',
      description:
        'L’éclairage est spécifié comme une couche complète : général, de travail et d’accent, lié aux détails de plafond et de menuiserie. Nous coordonnons luminaires, commandes et variation d’intensité pour que l’espace fonctionne le jour comme la nuit, sans compromis de dernière minute.',
    },
  },
  {
    type: ServiceType.WOODWORK_JOINERY,
    slug: 'woodwork-joinery',
    sortOrder: 7,
    en: {
      title: 'Woodwork & Joinery',
      excerpt: 'Custom millwork built for daily use, not just first impressions.',
      description:
        'From built-in storage to feature millwork, joinery is designed around circulation, hardware, and the materials around it. We work from site dimensions so doors, drawers, and reveals align with walls, ceilings, and lighting.',
    },
    fr: {
      title: 'Menuiserie',
      excerpt: 'Une menuiserie sur mesure pensée pour le quotidien, pas seulement pour l’effet.',
      description:
        'Des rangements intégrés aux pièces de menuiserie d’exception, le travail est conçu autour de la circulation, de la quincaillerie et des matériaux voisins. Nous partons des cotes de chantier pour que portes, tiroirs et jeux s’alignent avec murs, plafonds et éclairage.',
    },
  },
  {
    type: ServiceType.KITCHENS,
    slug: 'kitchens',
    sortOrder: 8,
    en: {
      title: 'Kitchens',
      excerpt: 'Kitchens planned around workflow, appliances, and finishes.',
      description:
        'Kitchen projects combine layout, cabinetry, worktops, and services. We coordinate plumbing, ventilation, lighting, and storage so the kitchen is efficient to use and consistent with the rest of the interior.',
    },
    fr: {
      title: 'Cuisines',
      excerpt: 'Des cuisines pensées autour du geste, des appareils et des finitions.',
      description:
        'Un projet cuisine relie implantation, meubles, plans de travail et lots techniques. Nous coordonnons plomberie, ventilation, éclairage et rangements pour une cuisine efficace au quotidien et cohérente avec le reste de l’intérieur.',
    },
  },
  {
    type: ServiceType.BATHROOMS,
    slug: 'bathrooms',
    sortOrder: 9,
    en: {
      title: 'Bathrooms',
      excerpt: 'Wet rooms detailed for waterproofing, fixtures, and light.',
      description:
        'Bathrooms are built from the waterproofing layer out: layout, tiling, sanitary ware, vanities, and lighting. Details at wet junctions, niches, and thresholds are planned so the room stays durable as well as refined.',
    },
    fr: {
      title: 'Salles de bain',
      excerpt: 'Des pièces d’eau détaillées pour l’étanchéité, les sanitaires et la lumière.',
      description:
        'La salle de bain se construit depuis la couche d’étanchéité : implantation, carrelage, sanitaires, meubles vasque et éclairage. Les détails aux raccords humides, niches et seuils sont prévus pour un espace durable autant que soigné.',
    },
  },
  {
    type: ServiceType.METAL_WORK,
    slug: 'metal-work',
    sortOrder: 10,
    en: {
      title: 'Metal Work',
      excerpt: 'Custom metal elements that sit cleanly in the architecture.',
      description:
        'Railings, frames, screens, and custom metal details are fabricated to match the interior language. We coordinate finishes, fixings, and adjacent materials so metalwork feels integrated rather than added on.',
    },
    fr: {
      title: 'Métallerie',
      excerpt: 'Des éléments métalliques sur mesure, intégrés à l’architecture.',
      description:
        'Gardes-corps, cadres, claustras et détails métalliques sont fabriqués dans le langage de l’intérieur. Nous coordonnons finitions, fixations et matériaux adjacents pour que la métallerie paraisse intégrée, et non rapportée.',
    },
  },
  {
    type: ServiceType.GLASS_WORK,
    slug: 'glass-work',
    sortOrder: 11,
    en: {
      title: 'Glass Work',
      excerpt: 'Partitions, shower screens, and glazing with precise edges.',
      description:
        'Glass is used for light, privacy, and spatial definition — partitions, shower enclosures, and feature glazing. Hardware, seals, and edge conditions are specified so the install is quiet, safe, and easy to maintain.',
    },
    fr: {
      title: 'Vitrerie',
      excerpt: 'Cloisons, parois de douche et vitrages aux arêtes précises.',
      description:
        'Le verre sert la lumière, l’intimité et la définition de l’espace — cloisons, parois de douche et vitrages d’exception. Quincaillerie, joints et conditions d’arête sont spécifiés pour une pose discrète, sûre et facile à entretenir.',
    },
  },
  {
    type: ServiceType.FULL_INTERIOR_RENOVATION,
    slug: 'full-interior-renovation',
    sortOrder: 12,
    en: {
      title: 'Full Interior Renovation',
      excerpt: 'End-to-end renovation with one team coordinating every trade.',
      description:
        'A full renovation brings layout, finishes, and trades under one sequence: demolition through handover. We coordinate flooring, walls, ceilings, joinery, kitchens, bathrooms, lighting, and custom work so the project reads as one interior rather than a collection of separate jobs.',
    },
    fr: {
      title: 'Rénovation intérieure complète',
      excerpt: 'Une rénovation de bout en bout, avec une seule équipe qui coordonne tous les lots.',
      description:
        'Une rénovation complète rassemble implantation, finitions et corps de métier dans une même séquence, de la démolition à la livraison. Nous coordonnons sols, murs, plafonds, menuiserie, cuisines, salles de bain, éclairage et ouvrages sur mesure pour un intérieur unique, pas une collection de chantiers séparés.',
    },
  },
];
