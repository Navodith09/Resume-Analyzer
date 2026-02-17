import logging
import pdfplumber
import docx

logger = logging.getLogger(__name__)

def extract_text_from_file(uploaded_file):
    """
    Extracts text from a PDF or DOCX file.
    """
    try:
        filename = uploaded_file.name.lower()
        text = ""

        if filename.endswith('.pdf'):
            # pdfplumber.open can handle file-like objects
            with pdfplumber.open(uploaded_file) as pdf:
                text = "".join([page.extract_text() or "" for page in pdf.pages])
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            try:
                doc = docx.Document(uploaded_file)
                text = "\n".join([para.text for para in doc.paragraphs])
            except Exception as e:
                logger.error(f"Error reading docx file: {e}")
                return ""
        else:
            logger.warning(f"Unsupported file format: {filename}")
            return ""

        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from file: {e}")
        return ""
