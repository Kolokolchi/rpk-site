import { MessageCircle } from "lucide-react";

export default function FloatingContact({
  whatsappHref,
}: {
  whatsappHref: string;
}) {
  return (
    <a
      className="floating-contact-button"
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Рассчитать проект в WhatsApp"
      title="Рассчитать проект в WhatsApp"
    >
      <MessageCircle aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
