import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function generateSolicitudPDF(lead, enrollment) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 612;
  const pageHeight = 792;

  const logoBytes = await fetch('/uninterlogonofondo.png').then(res => res.arrayBuffer());
  const logo = await pdfDoc.embedPng(logoBytes);

  const drawText = (page, text, x, y, size = 10, bold = false, maxWidth = 400) => {
    if (!text) return;
    const fontSize = size;
    const lines = [];
    let line = '';

    text.split(' ').forEach(word => {
      if (font.widthOfTextAtSize(line + ' ' + word, fontSize) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    });
    lines.push(line);

    lines.forEach((line, i) => {
      page.drawText(line, {
        x,
        y: y - i * (fontSize + 2),
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  };

  const drawLine = (page, x, y, length = 500) => {
    page.drawLine({
      start: { x, y },
      end: { x: x + length, y },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  };

  const drawHeader = (page) => {
    page.drawRectangle({ x: 0, y: pageHeight - 80, width: pageWidth, height: 80, color: rgb(0.07, 0.2, 0.4) });
    page.drawImage(logo, { x: 40, y: pageHeight - 70, width: 50, height: 50 });
    page.drawText('Solicitud de Información', {
      x: 110,
      y: pageHeight - 40,
      size: 16,
      font,
      color: rgb(1, 1, 1),
    });
    page.drawText('Dirección de Asuntos Estudiantiles y Admisiones', {
      x: 110,
      y: pageHeight - 60,
      size: 10,
      font,
      color: rgb(1, 1, 1),
    });
  };

  const drawPrivacyBlock = (page) => {
    page.drawRectangle({ x: 40, y: pageHeight - 130, width: 530, height: 40, color: rgb(0.8, 0.9, 1) });
    drawText(page, 'Política de privacidad para la protección de Datos Personales', 45, pageHeight - 115, 9);
    const text = 'La Universidad Internacional, con domicilio en San Jerónimo 204 de la Colonia San Jerónimo...';
    drawText(page, text, 45, pageHeight - 130, 6.5, false, 520);
  };

  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  drawHeader(page1);
  drawPrivacyBlock(page1);

  drawText(page1, 'Programa a Ingresar:', 40, pageHeight - 180);
  drawText(page1, enrollment.career || '', 170, pageHeight - 180);
  drawLine(page1, 170, pageHeight - 182, 180);

  drawText(page1, 'Semestre o grado:', 360, pageHeight - 180);
  drawText(page1, lead.semester || '', 480, pageHeight - 180);
  drawLine(page1, 480, pageHeight - 182, 80);

  drawText(page1, 'Modalidad:', 40, pageHeight - 200);
  drawLine(page1, 170, pageHeight - 202, 180);

  drawText(page1, 'Fecha:', 360, pageHeight - 200);
  drawText(page1, new Date(enrollment.date).toLocaleDateString(), 480, pageHeight - 200);
  drawLine(page1, 480, pageHeight - 202, 80);

  drawText(page1, 'Datos personales', 40, pageHeight - 230, 11);
  drawLine(page1, 40, pageHeight - 232, 530);

  drawText(page1, 'Nombre del Alumno:', 40, pageHeight - 250);
  drawText(page1, lead.name || '', 170, pageHeight - 250);
  drawLine(page1, 170, pageHeight - 252, 180);

  drawText(page1, 'Teléfono:', 40, pageHeight - 270);
  drawText(page1, lead.phones.map(p => p.telephone).join(', '), 170, pageHeight - 270);
  drawLine(page1, 170, pageHeight - 272, 180);

  drawText(page1, 'Correo Electrónico:', 40, pageHeight - 290);
  drawText(page1, lead.emails.map(e => e.email).join(', '), 170, pageHeight - 290);
  drawLine(page1, 170, pageHeight - 292, 180);

  drawText(page1, 'Facebook:', 40, pageHeight - 310);
  drawLine(page1, 170, pageHeight - 312, 180);

  drawText(page1, 'Lugar de residencia:', 40, pageHeight - 330);
  drawText(page1, `${lead.city || ''}, ${lead.state || ''}`, 170, pageHeight - 330);
  drawLine(page1, 170, pageHeight - 332, 180);

  drawText(page1, 'Fecha de Nacimiento:', 40, pageHeight - 350);
  drawLine(page1, 170, pageHeight - 352, 180);

  drawText(page1, 'Lugar de Nacimiento:', 40, pageHeight - 370);
  drawLine(page1, 170, pageHeight - 372, 180);

  drawText(page1, 'Escuela de procedencia:', 40, pageHeight - 390);
  drawText(page1, lead.formerSchool || '', 170, pageHeight - 390);
  drawLine(page1, 170, pageHeight - 392, 180);

  drawText(page1, 'Promedio:', 40, pageHeight - 410);
  drawLine(page1, 170, pageHeight - 412, 180);

  drawText(page1, 'Estado:', 40, pageHeight - 430);
  drawText(page1, lead.state || '', 170, pageHeight - 430);
  drawLine(page1, 170, pageHeight - 432, 180);

  drawText(page1, 'Ciclo escolar:', 40, pageHeight - 450);
  drawLine(page1, 170, pageHeight - 452, 60);
  drawText(page1, 'agosto', 235, pageHeight - 450);
  drawLine(page1, 275, pageHeight - 452, 50);
  drawText(page1, 'enero', 330, pageHeight - 450);
  drawLine(page1, 370, pageHeight - 452, 50);

  drawText(page1, 'Menciona el nombre de las instituciones que tienes contempladas como opción a ingresar (indícalas en orden de preferencia)', 40, pageHeight - 480, 9);
  drawLine(page1, 40, pageHeight - 495, 530);
  drawLine(page1, 40, pageHeight - 515, 530);
  drawLine(page1, 40, pageHeight - 535, 530);

  drawText(page1, '¿En base a qué criterios elegirías la institución donde deseas estudiar?', 40, pageHeight - 555, 9);
  const criteria = ['Profesorado', 'Mis Amigos', 'Mi familia', 'Plan de Estudios', 'Prestigios de la Institución', 'Ambiente', 'Instalaciones', 'Superación Personal', 'Otro'];
  const startX = 40;
  let x = startX;
  let y = pageHeight - 575;
  criteria.forEach((label, index) => {
    page1.drawRectangle({ x, y, width: 10, height: 10, borderWidth: 0.5, borderColor: rgb(0, 0, 0) });
    drawText(page1, label, x + 15, y + 1, 8);
    x += 170;
    if ((index + 1) % 2 === 0) {
      x = startX;
      y -= 20;
    }
  });

  drawText(page1, 'Hermanos y Familiares', 40, y - 20, 9);
  drawText(page1, 'Nombre:', 40, y - 40);
  drawLine(page1, 100, y - 42, 200);
  drawText(page1, 'Edad:', 320, y - 40);
  drawLine(page1, 360, y - 42, 50);
  drawText(page1, 'Escuela y/o empresa en la que asisten:', 40, y - 60);
  drawLine(page1, 250, y - 62, 320);

  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);

  drawText(page2, '¿Por qué medio te enteraste de UNINTER?', 40, pageHeight - 80);
  drawLine(page2, 40, pageHeight - 82, 500);

  drawText(page2, '¿Qué opinión tienes del proceso de inscripción?', 40, pageHeight - 120);
  drawLine(page2, 40, pageHeight - 122, 500);
  drawLine(page2, 40, pageHeight - 140, 500);
  drawLine(page2, 40, pageHeight - 158, 500);

  const promotor = `${lead.promoterName || ''} ${lead.promoterPaternalSurname || ''}`.trim();
  drawText(page2, '¿Quién te atendió?', 40, pageHeight - 190);
  drawText(page2, promotor, 150, pageHeight - 190);
  drawLine(page2, 150, pageHeight - 192, 300);

  drawText(page2, '¿Cómo fue el trato recibido?', 40, pageHeight - 220);
  drawLine(page2, 40, pageHeight - 222, 500);
  drawLine(page2, 40, pageHeight - 240, 500);

  drawText(page2, 'Firma del alumno:', 40, pageHeight - 280);
  drawLine(page2, 150, pageHeight - 282, 300);

  drawText(page2, 'Observaciones:', 40, pageHeight - 320);
  drawLine(page2, 40, pageHeight - 322, 500);
  drawLine(page2, 40, pageHeight - 340, 500);
  drawLine(page2, 40, pageHeight - 358, 500);

  drawText(page2, 'Para uso institucional', 40, pageHeight - 400, 11);
  drawLine(page2, 40, pageHeight - 402, 530);
  drawText(page2, 'Tipo de promoción:', 40, pageHeight - 420);
  drawLine(page2, 150, pageHeight - 422, 200);
  drawText(page2, 'Beca asignada (%):', 40, pageHeight - 440);
  drawLine(page2, 150, pageHeight - 442, 200);
  drawText(page2, 'Folio de inscripción:', 40, pageHeight - 460);
  drawLine(page2, 150, pageHeight - 462, 200);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `solicitud-${lead.name || 'lead'}.pdf`);
}
