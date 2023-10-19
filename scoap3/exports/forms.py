from django import forms


class AffiliationExportForm(forms.Form):
    country_code = forms.CharField(label="Country", required=True, max_length=4)
    year = forms.IntegerField(label="Year", required=True)

class AuthorExportForm(forms.Form):
    country_code = forms.CharField(label="Country", required=True, max_length=4)
    year = forms.IntegerField(label="Year", required=True)