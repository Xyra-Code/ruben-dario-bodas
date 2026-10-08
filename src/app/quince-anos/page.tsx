import { PaginaServicio, metadatosServicio } from "@/components/plantillas/PaginaServicio";

export const metadata = metadatosServicio("quince");

export default function QuinceAnos() {
  return <PaginaServicio tipo="quince" />;
}
