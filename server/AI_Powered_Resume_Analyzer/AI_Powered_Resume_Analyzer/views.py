from django.http import JsonResponse

def health_check(request):
    """
    Simple endpoint to check if the server is running properly.
    Returns:
        JsonResponse: 200 OK and an 'status': 'ok' object
    """
    return JsonResponse({'status': 'ok'}, status=200)
