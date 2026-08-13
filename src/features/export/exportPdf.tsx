import { pdf } from "@react-pdf/renderer";
import { downloadBlob } from "../../lib/download";
import { slugify } from "../../lib/duration";
import type { AgendaBlock, Meeting } from "../../types/meeting";
import { PreReadDocument } from "./PreReadDocument";

export async function downloadPreReadPdf(
  meeting: Meeting,
  blocks: AgendaBlock[],
): Promise<void> {
  const blob = await pdf(
    <PreReadDocument meeting={meeting} blocks={blocks} />,
  ).toBlob();
  downloadBlob(blob, `${slugify(meeting.title)}-preread.pdf`);
}
