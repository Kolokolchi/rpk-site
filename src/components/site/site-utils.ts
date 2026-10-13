import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Factory,
  Hammer,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { bundledBrandImages } from "../../assets/brand-images";
import { bundledCatalogImages } from "../../assets/catalog-images";
import { bundledProjectImages } from "../../assets/project-images";
import { publicPath } from "../../shared/public-path";

export const logoMark = publicPath("/assets/brand/rpk-logo-light.svg");
export const introLetterBlueprint = publicPath(
  "/assets/intro-letter-blueprint.svg",
);

export const iconMap = {
  badge: BadgeCheck,
  check: CheckCircle2,
  clock: Clock3,
  factory: Factory,
  hammer: Hammer,
  ruler: Ruler,
  shield: ShieldCheck,
};

export function revealDelayClass(index: number) {
  return `reveal-delay-${Math.min(Math.max(index, 0), 10)}`;
}

export function publicAssetUrl(source: string) {
  return publicPath(
    source.startsWith("/src/assets/")
      ? source.replace("/src/assets/", "/assets/")
      : source,
  );
}

export function siteImageSource(source: string) {
  return (
    bundledProjectImages[source] ||
    bundledBrandImages[source] ||
    bundledCatalogImages[source]
  );
}

export function resolveImageSource(source: string) {
  return siteImageSource(source)?.src || publicAssetUrl(source);
}

export function phoneLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappLink(phone: string, serviceTitle?: string) {
  const message = serviceTitle
    ? [
        "Здравствуйте! Нужен расчёт.",
        `Услуга: ${serviceTitle}`,
        "Адрес объекта: ",
        "Примерные размеры: ",
        "Фото отправлю следующим сообщением.",
      ]
    : [
        "Здравствуйте! Нужен предварительный расчёт.",
        "Тип объекта: ",
        "Адрес: ",
        "Примерные размеры: ",
        "Фото отправлю следующим сообщением.",
      ];
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message.join("\n"))}`;
}

export function safeExternalUrl(value: string) {
  try {
    const normalized = value.startsWith("https://")
      ? value
      : `https://${value}`;
    const url = new URL(normalized);
    return url.protocol === "https:" &&
      ["rpk.kz", "www.rpk.kz"].includes(url.hostname)
      ? url.href
      : "#";
  } catch {
    return "#";
  }
}
