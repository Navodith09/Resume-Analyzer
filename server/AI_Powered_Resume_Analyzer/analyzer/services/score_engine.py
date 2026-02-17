import logging

logger = logging.getLogger(__name__)

def calculate_ats_score(analysis_results):
    """
    Calculates the ATS score based on matched and missing skills.
    """
    try:
        if "error" in analysis_results:
            return 0

        matched = len(analysis_results.get('matched_skills', []))
        missing = len(analysis_results.get('missing_skills', []))
        total_required = matched + missing

        if total_required == 0:
            return 0

        score = (matched / total_required) * 100
        return round(score, 2)
    except Exception as e:
        logger.error(f"Error calculating ATS score: {e}")
        return 0
