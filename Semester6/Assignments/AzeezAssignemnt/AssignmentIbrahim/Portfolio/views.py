from django.http import HttpResponse

def portfolio(request):
    html_content = """
    <html>
    <head>
        <title>Hello</title>
    </head>
    <body>
        <p>Hi</p>
    </body>
    </html>
    """
    return HttpResponse(html_content)
