from django import forms
from django_select2.forms import ModelSelect2Widget

from scoap3.misc.models import Country

class CountryWidget(ModelSelect2Widget):
    search_fields = [ 
        "code__icontains",
        "name__icontains"
    ]

class Country2Widget(ModelSelect2Widget):
    search_fields = [ 
        "code__icontains",
        "name__icontains"
    ]

class AffiliationExportForm(forms.Form):
    aff_year = forms.IntegerField(label="Year", required=True)
    aff_country = forms.ModelChoiceField(
        queryset=Country.objects.all(),
        widget=Country2Widget,
        label="Country",
        required=True
    )


class AuthorExportForm(forms.Form):
    author_year = forms.IntegerField(label="Year", required=True)
    author_country = forms.ModelChoiceField(
        queryset=Country.objects.all(),
        widget=CountryWidget,
        label="Country",
        required=True
    )