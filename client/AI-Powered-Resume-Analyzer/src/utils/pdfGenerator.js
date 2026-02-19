import jsPDF from 'jspdf';

export const generatePDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;
    
    // Helper for centered text
    const centerText = (text, y) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Helper for wrapped text
    const addWrappedText = (text, y, fontSize = 10, fontStyle = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(splitText, margin, y);
        return y + (splitText.length * fontSize * 0.5) + 5; // Return new Y position
    };

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    centerText("Resume Analysis Report", yPos);
    yPos += 15;

    // --- Job Title ---
    const jobTitle = data.job_title || data.extracted_job_title || data.analysis?.extracted_job_title || "Job Role";
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    centerText(jobTitle, yPos);
    yPos += 20;

    // --- Score ---
    const score = data.score || 0;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    centerText(`ATS Score: ${score}/100`, yPos);
    yPos += 15;

    // --- Status ---
    let statusText = "Needs Improvement";
    let statusColor = [220, 38, 38]; // Red
    if (score >= 80) {
        statusText = "Excellent Match";
        statusColor = [22, 163, 74]; // Green
    } else if (score >= 60) {
        statusText = "Good Match";
        statusColor = [202, 138, 4]; // Yellow/Orange
    }
    
    doc.setFontSize(14);
    doc.setTextColor(...statusColor);
    centerText(statusText, yPos);
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 20;

    const analysis = data.analysis || {};

    // --- Executive Summary ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Executive Summary", margin, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summary = analysis.professional_summary || "No summary available.";
    yPos = addWrappedText(summary, yPos, 11);
    yPos += 5;

    // --- Missing Keywords ---
    if (yPos > 250) { doc.addPage(); yPos = 20; } // Page break check
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Missing Keywords", margin, yPos);
    yPos += 10;

    const missingSkills = analysis.missing_skills || [];
    if (missingSkills.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const skillsText = missingSkills.join(', ');
        yPos = addWrappedText(skillsText, yPos, 11);
    } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.text("No missing keywords detected.", margin, yPos);
        yPos += 10;
    }
    yPos += 5;

    // --- Improvement Suggestions ---
    if (yPos > 230) { doc.addPage(); yPos = 20; } // Page break check

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Improvement Suggestions", margin, yPos);
    yPos += 10;

    const improvements = analysis.improvement_suggestions || [];
    if (improvements.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        improvements.forEach(item => {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            // Add bullet point
            doc.text("•", margin, yPos);
            const splitItem = doc.splitTextToSize(item, pageWidth - margin * 2 - 5);
            doc.text(splitItem, margin + 5, yPos);
            yPos += (splitItem.length * 6) + 4;
        });
    } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.text("No suggestions available.", margin, yPos);
        yPos += 10;
    }

    // Save with sanitized filename
    const safeTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    doc.save(`Resume_Analysis_${safeTitle}_${new Date().toISOString().slice(0,10)}.pdf`);
};
