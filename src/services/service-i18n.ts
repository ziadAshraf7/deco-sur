import { Service } from '@prisma/client';
import { I18nContext } from 'nestjs-i18n';

export type AppLang = 'en' | 'fr';

export function resolveAppLang(lang?: string): AppLang {
  const resolved = lang ?? I18nContext.current()?.lang ?? 'en';
  return resolved.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function toPublicService(service: Service, lang?: string) {
  const locale = resolveAppLang(lang);
  const isFr = locale === 'fr';

  return {
    id: service.id,
    type: service.type,
    slug: service.slug,
    title: (isFr ? service.titleFr : service.titleEn) || service.titleEn,
    excerpt: (isFr ? service.excerptFr : service.excerptEn) || service.excerptEn,
    description:
      (isFr ? service.descriptionFr : service.descriptionEn) || service.descriptionEn,
    imageUrl: service.imageUrl,
    isActive: service.isActive,
    sortOrder: service.sortOrder,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export function toAdminService(service: Service) {
  return {
    id: service.id,
    type: service.type,
    slug: service.slug,
    title: { en: service.titleEn, fr: service.titleFr },
    excerpt: { en: service.excerptEn, fr: service.excerptFr },
    description: { en: service.descriptionEn, fr: service.descriptionFr },
    imageUrl: service.imageUrl,
    isActive: service.isActive,
    sortOrder: service.sortOrder,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}
