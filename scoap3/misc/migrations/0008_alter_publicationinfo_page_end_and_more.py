# Generated by Django 4.2.2 on 2023-06-19 13:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("misc", "0007_alter_affiliation_value_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="publicationinfo",
            name="page_end",
            field=models.CharField(blank=True, default=" "),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="publicationinfo",
            name="page_start",
            field=models.CharField(blank=True, default=" "),
            preserve_default=False,
        ),
    ]
