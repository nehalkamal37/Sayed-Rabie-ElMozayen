import { branchPath, type Branch, type BranchDetail } from "@/data/branches";
import { services } from "@/data/services";
import { bookingPhone, brandName, productionUrl } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";

/**
 * Structured data, limited to confirmed facts. It needs real absolute URLs, so
 * nothing is output until the production domain is configured.
 */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
          /</g,
          "\u003c",
        ),
      }}
    />
  );
}

const organizationId = `${productionUrl}/#organization`;

export function OrganizationJsonLd() {
  if (!productionUrl) return null;
  return (
    <JsonLd
      data={{
        "@type": "Organization",
        "@id": organizationId,
        name: brandName.ar,
        alternateName: brandName.en,
        url: `${productionUrl}/`,
        logo: `${productionUrl}/brand/logo-brown.webp`,
      }}
    />
  );
}

/** Prices join each offer as they are verified. */
export function ServicesJsonLd({ locale, name }: { locale: Locale; name: string }) {
  if (!productionUrl) return null;
  return (
    <JsonLd
      data={{
        "@type": "OfferCatalog",
        name,
        url: `${productionUrl}${localePath(locale, "/services")}`,
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          ...(service.price.status === "verified"
            ? { price: service.price.value, priceCurrency: "EGP" }
            : {}),
          itemOffered: {
            "@type": "Service",
            name: service.name[locale],
            description: service.description[locale],
            provider: { "@id": organizationId },
          },
        })),
      }}
    />
  );
}

/**
 * A HairSalon needs its address, so this waits for a verified one. Add
 * openingHoursSpecification, geo and image when those are approved.
 */
export function BranchJsonLd({
  locale,
  branch,
  detail,
}: {
  locale: Locale;
  branch: Branch;
  detail: BranchDetail;
}) {
  if (!productionUrl || branch.address.status !== "verified") return null;
  return (
    <JsonLd
      data={{
        "@type": "HairSalon",
        name: detail.heading[locale],
        url: `${productionUrl}${localePath(locale, branchPath(branch.id))}`,
        parentOrganization: { "@id": organizationId },
        address: branch.address.value[locale],
        ...(bookingPhone.status === "verified" ? { telephone: bookingPhone.value.e164 } : {}),
        ...(branch.directionsUrl.status === "verified" ? { hasMap: branch.directionsUrl.value } : {}),
      }}
    />
  );
}
