
import { ProjectData } from '@/types';
import { jsPDF } from 'jspdf';

export interface PDFColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  muted: string;
  border: string;
}

export interface PDFContext {
  pdf: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  yPosition: number;
  pageNumber: number;
  colors: PDFColors;
}

export interface PDFSectionRenderer {
  render: (ctx: PDFContext, projectData: ProjectData) => void;
}

export const COLORS: PDFColors = {
  primary: '#333333',
  secondary: '#666666',
  accent: '#f8b500', // Yellow accent for F9 Productions
  background: '#ffffff',
  muted: '#f5f5f5',
  border: '#e0e0e0',
};
