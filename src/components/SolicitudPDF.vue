<script setup>
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

const props = defineProps({
  lead: Object,
  enrollment: Object
});

const generate = async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 792]); // Carta: 8.5 x 11 pulgadas
  const { width, height } = page.getSize();

  const drawText = (text, x, y, size = 10, bold = false) => {
    page.drawText(text || '', {
      x,
      y,
      size,
      font: bold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
  };

  const drawLine = (x1, y1, x2, y2) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6)
    });
  };

  const drawCheckbox = (x, y, checked = false) => {
    page.drawRectangle({ x, y, width: 10, height: 10, borderWidth: 0.5, borderColor: rgb(0, 0, 0) });
    if (checked) {
      page.drawLine({ start: { x: x + 2, y: y + 5 }, end: { x: x + 4, y: y + 2 }, thickness: 1 });
      page.drawLine({ start: { x: x + 4, y: y + 2 }, end: { x: x + 8, y: y + 8 }, thickness: 1 });
    }
  };

  // Header azul con logo
  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: rgb(0.07, 0.2, 0.4) });

  const logoUrl = `${window.location.origin}/uninterlogonofondo.png`;
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImg = await pdfDoc.embedPng(logoBytes);
  page.drawImage(logoImg, { x: 30, y: height - 50, width: 50, height: 50 });

  drawText('Universidad Internacional', 90, height - 30, 12, true);
  drawText('SECUNDARIA. BACHILLERATO. LICENCIATURA. INGENIERÍA. POSGRADO', 90, height - 45, 7);

  // Datos personales
  drawText('Nombre del prospecto:', 40, 710, 9, true);
  drawText(props.lead.name, 180, 710);

  drawText('Teléfono:', 40, 690, 9, true);
  drawText(props.lead.phones?.join(', '), 180, 690);

  drawText('Correo electrónico:', 40, 670, 9, true);
  drawText(props.lead.emails?.join(', '), 180, 670);

  drawText('Ciudad / Estado / País:', 40, 650, 9, true);
  drawText(`${props.lead.city}, ${props.lead.state}, ${props.lead.country}`, 180, 650);

  drawText('Promotor:', 40, 630, 9, true);
  drawText(`${props.lead.promoterName} ${props.lead.promoterPaternalSurname}`, 180, 630);

  drawLine(40, 620, width - 40, 620); // Línea divisoria

  // Datos académicos
  drawText('Carrera:', 40, 600, 9, true);
  drawText(props.enrollment.career, 180, 600);

  drawText('Grado:', 40, 580, 9, true);
  drawText(props.lead.grade, 180, 580);

  drawText('Semestre:', 40, 560, 9, true);
  drawText(props.lead.semester, 180, 560);

  drawText('Ciclo escolar:', 40, 540, 9, true);
  drawText(props.lead.cycle, 180, 540);

  drawText('Fecha de inscripción:', 40, 520, 9, true);
  drawText(new Date(props.enrollment.date).toLocaleDateString(), 180, 520);

  drawLine(40, 510, width - 40, 510);

  // Opciones de ingreso (ejemplo con checkboxes)
  drawText('Opciones de ingreso:', 40, 490, 9, true);
  drawCheckbox(60, 470, props.lead.typeSchool === 'PUBLICA');
  drawText('Pública', 75, 472);
  drawCheckbox(150, 470, props.lead.typeSchool === 'PRIVADA');
  drawText('Privada', 165, 472);

  drawLine(40, 460, width - 40, 460);

  // Reverso (segunda página)
  const page2 = pdfDoc.addPage([612, 792]);
  drawText('Campaña:', 40, 710, 9, true);
  drawText(props.lead.campaign, 180, 710);
  drawText('Asset name:', 40, 690, 9, true);
  drawText(props.lead.asetName, 180, 690);
  drawText('Tipo de contacto:', 40, 670, 9, true);
  drawText(props.lead.contactType, 180, 670);

  drawText('Referido:', 40, 640, 9, true);
  drawText(props.lead.nameReference || '', 180, 640);
  drawText('Tipo de referido:', 40, 620, 9, true);
  drawText(props.lead.type || '', 180, 620);

  // Footer azul
  page2.drawRectangle({ x: 0, y: 0, width, height: 60, color: rgb(0.07, 0.2, 0.4) });
  page2.drawImage(logoImg, { x: 30, y: 10, width: 40, height: 40 });
  drawText('Universidad Internacional', 80, 38, 10, true);
  drawText('SECUNDARIA. BACHILLERATO. LICENCIATURA. INGENIERÍA. POSGRADO', 80, 25, 6);
  drawText('COMUNIDAD UNINTER', 380, 38, 8.5, true);
  drawText('admisionese@uninter.edu.mx', 380, 28, 6);
  drawText('www.uninter.edu.mx', 380, 18, 6);
  drawText('Tel: 777 357 9000 / 777 332 8320 / 777 357 9001', 380, 8, 6);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `solicitud-${props.lead.name || 'prospecto'}.pdf`);
};

defineExpose({ generate });
</script>

<template>
  <!-- Oculto intencionalmente -->
  <div class="hidden"></div>
</template>
