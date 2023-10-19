from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import messages
import csv
import datetime

from scoap3.utils.tools import affiliation_export, author_export

from .forms import AffiliationExportForm, AuthorExportForm

def generate_csv_response(data, action_name, write_header=True):
    response = HttpResponse(
        content_type="text/csv",
        headers={
            "Content-Disposition": \
                f'attachment; filename="scoap3_{action_name}_{datetime.datetime.now()}.csv"'},
    )

    writer = csv.writer(response)
    if write_header:
        writer.writerow(data.get('header'))
    print(data)
    for row in data.get('data', []):
        writer.writerow(row)

    return response

def get_exports(request):
    action_name = None
    if "affiliation_export" in request.POST:
        action_name = "affiliation_export"
        affiliation_form = AffiliationExportForm(request.POST)
    else:
        affiliation_form = AffiliationExportForm()
    if "author_export" in request.POST:
        action_name = "author_export"
        author_form = AuthorExportForm(request.POST)
    else:
        author_form = AuthorExportForm(None)

    if action_name and request.method == "POST":
        try:
            if "affiliation_export" in request.POST and affiliation_form.is_valid():
                year= affiliation_form.data.get('year')
                country= affiliation_form.data.get('country_code')
                result = affiliation_export(year or None, country or None)
            if "author_export" in request.POST and author_form.is_valid():
                year= author_form.data.get('year')
                country= author_form.data.get('country_code')
                result = author_export(year or None, country or None)

            response = generate_csv_response(result, action_name)

            return response
        except Exception as ex:
            messages.error(request, f'There was an error: {ex}')

    return render(request, "admin/tools.html", {"affiliation_form": affiliation_form, "author_form": author_form})