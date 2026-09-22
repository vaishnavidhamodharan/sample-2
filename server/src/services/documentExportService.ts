import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export class DocumentExportService {
  /**
   * Generates a clean TXT buffer containing the exact cleaned document content.
   */
  public static async generateTxt(cleanedText: string): Promise<Buffer> {
    return Buffer.from(cleanedText, 'utf-8');
  }

  /**
   * Generates a professional Microsoft Word (.docx) document with proper formatting.
   */
  public static async generateDocx(title: string, cleanedText: string): Promise<Buffer> {
    const lines = cleanedText.split(/\r?\n/);
    const paragraphs: Paragraph[] = [];

    // Header Title
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 32, // 16pt
            font: 'Calibri',
            color: '2C2830',
          }),
        ],
      })
    );

    // Subheader metadata
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `DocuClean AI Restored Document • Processed ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            italics: true,
            size: 18, // 9pt
            font: 'Calibri',
            color: '6F6670',
          }),
        ],
      })
    );

    // Body content paragraphs
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [],
          })
        );
        continue;
      }

      // Check if line is a Heading (e.g. "SECTION 1...", "CHAPTER...", or all-caps short title)
      const isHeading =
        /^(SECTION|CHAPTER|\d+\.)/i.test(line) ||
        (line === line.toUpperCase() && line.length < 60 && !line.includes('$'));

      if (isHeading) {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: line,
                bold: true,
                size: 24, // 12pt
                font: 'Calibri',
                color: '3C8D87',
              }),
            ],
          })
        );
      } else if (line.startsWith('• ') || line.startsWith('- ')) {
        // Bullet list item
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: line.replace(/^[•\-]\s*/, ''),
                size: 22, // 11pt
                font: 'Calibri',
                color: '2C2830',
              }),
            ],
          })
        );
      } else {
        // Normal paragraph
        paragraphs.push(
          new Paragraph({
            spacing: { after: 140, line: 276 },
            children: [
              new TextRun({
                text: line,
                size: 22, // 11pt
                font: 'Calibri',
                color: '2C2830',
              }),
            ],
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Generates a clean, multi-page PDF document with line-wrapping, headers, and page numbers.
   */
  public static async generatePdf(title: string, cleanedText: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 595.28; // Standard A4
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    const fontSize = 10;
    const headingSize = 13;
    const lineHeight = 14;

    // Helper to wrap text into lines that fit within max width
    const wrapText = (text: string, font: typeof regularFont, size: number, maxWidth: number): string[] => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, size);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Draw document Header Banner
    currentPage.drawText(title, {
      x: margin,
      y: y,
      size: 16,
      font: boldFont,
      color: rgb(0.17, 0.16, 0.19),
    });
    y -= 18;

    currentPage.drawText(`Restored Document • Cleaned by DocuClean AI on ${new Date().toLocaleDateString('en-US')}`, {
      x: margin,
      y: y,
      size: 8,
      font: italicFont,
      color: rgb(0.43, 0.40, 0.44),
    });
    y -= 12;

    // Divider line
    currentPage.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 1,
      color: rgb(0.85, 0.82, 0.78),
    });
    y -= 20;

    const rawParagraphs = cleanedText.split(/\r?\n/);

    for (const rawPara of rawParagraphs) {
      const para = rawPara.trim();
      if (!para) {
        y -= 8;
        if (y < margin + 30) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin - 20;
        }
        continue;
      }

      const isHeading =
        /^(SECTION|CHAPTER|\d+\.)/i.test(para) ||
        (para === para.toUpperCase() && para.length < 60 && !para.includes('$'));

      const font = isHeading ? boldFont : regularFont;
      const currentFontSize = isHeading ? headingSize : fontSize;
      const currentLineHeight = isHeading ? 18 : lineHeight;
      const color = isHeading ? rgb(0.24, 0.55, 0.53) : rgb(0.17, 0.16, 0.19);

      const wrappedLines = wrapText(para, font, currentFontSize, contentWidth);

      for (const line of wrappedLines) {
        if (y < margin + 40) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin - 20;
        }

        currentPage.drawText(line, {
          x: margin,
          y: y,
          size: currentFontSize,
          font: font,
          color: color,
        });

        y -= currentLineHeight;
      }

      y -= 4; // Paragraph spacing
    }

    // Add page numbers at the bottom of all pages
    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const pageNumberText = `Page ${i + 1} of ${totalPages}`;
      const textWidth = regularFont.widthOfTextAtSize(pageNumberText, 8);
      page.drawText(pageNumberText, {
        x: (pageWidth - textWidth) / 2,
        y: margin - 20,
        size: 8,
        font: regularFont,
        color: rgb(0.59, 0.55, 0.57),
      });
    }

    return await pdfDoc.save();
  }
}
