"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChartPoint = {
  name: string;
  study: number;
  notes: number;
  quizzes: number;
};

type SubjectPoint = {
  name: string;
  value: number;
  color: string;
};

type TrackerStats = {
  totalFocus: string;
  knowledgeEq: string;
  maxStreak: string;
  targetGap: string;
};

type ExportTrackerPdfButtonProps = {
  chartData: ChartPoint[];
  subjectsData: SubjectPoint[];
  stats: TrackerStats;
};

export function ExportTrackerPdfButton({
  chartData,
  subjectsData,
  stats,
}: ExportTrackerPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const fileName = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    return `study-tracker-report-${date}.pdf`;
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 42;
      const contentWidth = pageWidth - margin * 2;

      let y = margin;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("Study Tracker Report", margin, y);

      y += 22;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(90, 90, 90);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      pdf.setTextColor(0, 0, 0);

      y += 28;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Highlights", margin, y);

      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const highlights = [
        `Total Focus: ${stats.totalFocus}`,
        `Knowledge EQ: ${stats.knowledgeEq}`,
        `Max Streak: ${stats.maxStreak}`,
        `Target Gap: ${stats.targetGap}`,
      ];
      highlights.forEach((line) => {
        pdf.text(`- ${line}`, margin, y);
        y += 15;
      });

      y += 10;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Last 7 Days", margin, y);

      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      const chartRows = chartData.length > 0
        ? chartData
        : [{ name: "N/A", study: 0, notes: 0, quizzes: 0 }];

      pdf.text("Day", margin, y);
      pdf.text("Study (h)", margin + contentWidth * 0.25, y);
      pdf.text("Notes", margin + contentWidth * 0.5, y);
      pdf.text("Quizzes", margin + contentWidth * 0.7, y);

      y += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 14;

      chartRows.forEach((row) => {
        if (y > 760) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(String(row.name), margin, y);
        pdf.text(String(row.study), margin + contentWidth * 0.25, y);
        pdf.text(String(row.notes), margin + contentWidth * 0.5, y);
        pdf.text(String(row.quizzes), margin + contentWidth * 0.7, y);
        y += 14;
      });

      y += 14;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Time Allocation by Subject", margin, y);

      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      const subjectRows = subjectsData.length > 0
        ? subjectsData
        : [{ name: "No tracked subject data", value: 0, color: "#64748b" }];

      subjectRows.forEach((row) => {
        if (y > 760) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(`- ${row.name}: ${row.value}%`, margin, y);
        y += 14;
      });

      pdf.save(fileName);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="rounded-xl shadow-lg text-white shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 font-bold"
    >
      <Download size={18} className="mr-2" />
      {isExporting ? "Exporting..." : "Export PDF"}
    </Button>
  );
}
