import { PaginaServicio, metadatosServicio } from "@/components/plantillas/PaginaServicio";

export const metadata = metadatosServicio("boda");

export default function Bodas() {
  return <PaginaServicio tipo="boda" />;
}
