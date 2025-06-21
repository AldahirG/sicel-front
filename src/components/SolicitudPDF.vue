<script setup>
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

const props = defineProps({
  lead: Object,
  enrollment: Object
});

const generateSolicitudPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 609.45;
  const pageHeight = 793.7;

  const loadImageFromPublic = async (path) => {
    const url = `${window.location.origin}/${path}`;
    const res = await fetch(url);
    return await res.arrayBuffer();
  };

  const frontBytes = await loadImageFromPublic('formulario_frente.jpg');
  const frontImg = await pdfDoc.embedJpg(frontBytes);
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  page1.drawImage(frontImg, { x: 0, y: 0, width: pageWidth, height: pageHeight });

  const backBytes = await loadImageFromPublic('formulario_reverso.jpg');
  const backImg = await pdfDoc.embedJpg(backBytes);
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  page2.drawImage(backImg, { x: 0, y: 0, width: pageWidth, height: pageHeight });

  const logoBytes = await loadImageFromPublic('396910a7-b9b9-48eb-991d-acbd92875c25.png');
  const logoImg = await pdfDoc.embedPng(logoBytes);
  page1.drawImage(logoImg, { x: 30, y: 730, width: 50, height: 50 });

  page1.drawText('Universidad Internacional', {
    x: 90,
    y: 755,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  page1.drawText('SECUNDARIA. BACHILLERATO. LICENCIATURA. INGENIERÍA. POSGRADO', {
    x: 90,
    y: 740,
    size: 7,
    font,
    color: rgb(0, 0, 0),
  });

  const privacyText = [
    'La Universidad Internacional, con domicilio en San Jerónimo 204 de la Colonia San Jerónimo, de esta misma ciudad de Cuernavaca,',
    'Morelos, México C.P. 62179, es responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su protección.',
    'Su información personal será utilizada indistintamente, en el caso de que usted sea aspirante, alumno, egresado, proveedor, colaborador o',
    'solicitante de empleo, para efectos académicos o administrativos, proveer de servicios, productos e información, participar sobre',
    'cambios en los mismos, evaluar la calidad de servicios que le brindamos, generar reportes con fines estadísticos que ayuden a la',
    'planeación estratégica y operativa de la institución, así como a la acreditación de sus programas académicos.',
    'Si usted desea conocer el aviso de privacidad, por favor le pedimos lo revise en:',
    'www.uninter.edu.mx/universidad/Política-Privacidad'
  ];

  privacyText.forEach((line, index) => {
    page1.drawText(line, {
      x: 30,
      y: 710 - index * 11,
      size: 6.5,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Pie de página reverso con fondo azul y nueva información
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: 60,
    color: rgb(0.07, 0.2, 0.4), // Azul oscuro
  });

  page2.drawImage(logoImg, { x: 30, y: 10, width: 40, height: 40 });
  page2.drawText('Universidad Internacional', {
    x: 80,
    y: 38,
    size: 10,
    font,
    color: rgb(1, 1, 1),
  });
  page2.drawText('SECUNDARIA. BACHILLERATO. LICENCIATURA. INGENIERÍA. POSGRADO', {
    x: 80,
    y: 25,
    size: 6,
    font,
    color: rgb(1, 1, 1),
  });

  const contactText = [
    'COMUNIDAD UNINTER',
    'admisionese@uninter.edu.mx',
    'www.uninter.edu.mx',
    'Tel: 777 357 9000 / 777 332 8320 / 777 357 9001'
  ];
  contactText.forEach((line, i) => {
    page2.drawText(line, {
      x: 370,
      y: 38 - i * 10,
      size: i === 0 ? 8.5 : 6,
      font,
      color: rgb(1, 1, 1),
    });
  });

  const drawText = (page, text, x, y, size = 10) => {
    page.drawText(text || '', {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // === Página 1: Frente ===
  drawText(page1, props.enrollment?.career, 120, 715);
  drawText(page1, props.lead?.semester, 440, 715);
  drawText(page1, new Date(props.enrollment?.date).toLocaleDateString(), 440, 700);

  drawText(page1, props.lead?.name, 120, 665);
  drawText(page1, props.lead?.phones?.join(', '), 120, 650);
  drawText(page1, props.lead?.emails?.join(', '), 120, 635);

  drawText(page1, props.lead?.formerSchool, 120, 605);
  drawText(page1, props.lead?.city, 120, 590);
  drawText(page1, props.lead?.state, 250, 590);
  drawText(page1, props.lead?.cycle, 440, 590);

  drawText(page1, props.lead?.promoterName + ' ' + props.lead?.promoterPaternalSurname, 120, 500);

  // === Página 2: Reverso ===
  drawText(page2, props.lead?.contactType, 300, 700);
  drawText(page2, props.lead?.asetName, 300, 685);
  drawText(page2, props.lead?.campaign, 300, 670);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `solicitud-${props.lead?.name || 'lead'}.pdf`);
};
</script>

<template>
  <div>
    <button
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="generateSolicitudPDF"
    >
      Descargar Solicitud en PDF
    </button>
  </div>
</template>
