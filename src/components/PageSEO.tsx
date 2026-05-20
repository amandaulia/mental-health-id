import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const SITE_URL = "https://mentalhealthid.lovable.app";

interface PageSEOProps {
  /**
   * Translation key under `seo.<pageKey>` containing `title` and `description`
   * for both English and Indonesian.
   */
  pageKey: string;
  /** Path for canonical + og:url. Defaults to current pathname. */
  path?: string;
  /** Optional override values (e.g. dynamic detail pages). */
  title?: string;
  description?: string;
  /** Optional JSON-LD structured data. Object → single node; array → @graph. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Per-route head that updates with the active language toggle.
 * Reads `seo.<pageKey>.title|description` from the LanguageContext.
 */
export const PageSEO = ({ pageKey, path, title, description, jsonLd }: PageSEOProps) => {
  const { language, t } = useLanguage();
  const resolvedPath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = `${SITE_URL}${resolvedPath}`;
  const finalTitle = title ?? t(`seo.${pageKey}.title`);
  const finalDescription = description ?? t(`seo.${pageKey}.description`);
  const ogLocale = language === "id" ? "id_ID" : "en_US";
  const altLocale = language === "id" ? "en_US" : "id_ID";

  const ldPayload = jsonLd
    ? Array.isArray(jsonLd)
      ? { "@context": "https://schema.org", "@graph": jsonLd }
      : { "@context": "https://schema.org", ...jsonLd }
    : null;

  return (
    <Helmet>
      <html lang={language === "id" ? "id" : "en"} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={altLocale} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      {ldPayload && (
        <script type="application/ld+json">{JSON.stringify(ldPayload)}</script>
      )}
    </Helmet>
  );
};