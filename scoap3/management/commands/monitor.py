import json
import os
import sys

import urllib3
from django.core.management.base import BaseCommand, CommandParser
from opensearchpy.exceptions import AuthenticationException

from scoap3.management.commands.elastic_search_client import OpenSearchClient
from scoap3.management.commands.utils import (
    get_countries_from_response,
    get_countries_from_response_legacy,
    get_dois_from_response,
    get_dois_from_response_legacy,
    get_mapped_dois_and_files_legacy,
    get_mapped_dois_and_files_new,
    get_new_added_files_new_scoap3,
    get_publishers_from_response,
    get_publishers_from_response_legacy,
    get_timestamp_str,
)

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class Command(BaseCommand):
    help = "Get all records DOIs count and countries for for specific range of time"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--batch-size",
            type=int,
            default=1000,
            required=False,
            help="Batchsize for upload per task",
        )
        parser.add_argument(
            "--time-unit",
            type=str,
            required=True,
            help="h - hours, d - days, w - weeks, m - months, y- years ",
        )
        parser.add_argument(
            "--gte",
            type=str,
            required=True,
            help="Records not older than",
        )
        parser.add_argument(
            "--from-date",
            type=str,
            required=False,
            help="Date 'from' which to fetch articles (article updated).",
        )
        parser.add_argument(
            "--legacy",
            type=bool,
            required=False,
            help="Should monitor legacy articles also",
        )

    def handle(self, *args, **options):
        es_configs = {
            "legacy": {
                "host": os.getenv("LEGACY_OPENSEARCH_HOST"),
                "username": os.getenv("LEGACY_OPENSEARCH_USERNAME", "CHANGEME"),
                "password": os.getenv("LEGACY_OPENSEARCH_PASSWORD", "CHANGEME"),
                "port": os.getenv("LEGACY_OPENSEARCH_PORT", 443),
                "index": os.getenv("LEGACY_OPENSEARCH_INDEX", "scoap3-records-record"),
            },
            "new": {
                "host": os.getenv("OPENSEARCH_HOST"),
                "username": os.getenv("OPENSEARCH_USERNAME", "CHANGEME"),
                "password": os.getenv("OPENSEARCH_PASSWORD", "CHANGEME"),
                "port": os.getenv("OPENSEARCH_PORT", 443),
                "index": os.getenv("OPENSEARCH_INDEX", "scoap3-backend-qa-articles"),
            },
        }

        try:
            if options["legacy"]:
                es_legacy = OpenSearchClient(**es_configs["legacy"])
            es_new = OpenSearchClient(**es_configs["new"])
        except AuthenticationException:
            self.stdout.write(
                self.style.WARNING(
                    """
                An error has occured while trying to connect to SEARCH_HOST!!!

                Please check config/credentials
            """
                )
            )
            sys.exit()
        except Exception:
            self.stdout.write(
                self.style.WARNING(
                    """
                An error has occured while trying to run monitoring!!!

                Make sure you have correctly set up the following ENV vars:

                OPENSEARCH_HOST
                OPENSEARCH_USERNAME
                OPENSEARCH_PASSWORD
                OPENSEARCH_PORT
                OPENSEARCH_INDEX

                LEGACY_OPENSEARCH_HOST
                LEGACY_OPENSEARCH_USERNAME
                LEGACY_OPENSEARCH_PASSWORD
                LEGACY_OPENSEARCH_PORT
                LEGACY_OPENSEARCH_INDEX


            """
                )
            )
            sys.exit()

        if options["legacy"]:
            dois_created = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_dois_from_response_legacy,
                action="_created",
            )

            dois_updated = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_dois_from_response_legacy,
                action="_updated",
            )

            countries = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_countries_from_response_legacy,
                action="_created",
            )

            countries_updated = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_countries_from_response_legacy,
                action="_updated",
            )

            mapped_dois_and_files_legacy = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_mapped_dois_and_files_legacy,
                action="_created",
            )

            mapped_dois_and_added_files_on_update = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_new_added_files_new_scoap3,
                action="_updated_at",
            )

            mapped_dois_and_publishers_created_legacy = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_publishers_from_response_legacy,
                action="_created_at",
            )

            mapped_dois_and_publishers_updated_legacy = es_legacy.get_items(
                batch_size=options["batch_size"],
                gte=options["gte"],
                time_unit=options["time_unit"],
                parse_function=get_publishers_from_response_legacy,
                action="_updated",
            )

            # summary = {
            #     "created_in_legacy_but_not_in_new": list(
            #         set(dois_created) - set(dois_created_new)
            #     ),
            #     "created_in_new_but_not_in_legacy": list(
            #         set(dois_created_new) - set(dois_created)
            #     ),
            #     "updated_in_legacy_but_not_in_new": list(
            #         set(dois_updated) - set(dois_updated_new)
            #     ),
            #     "updated_in_new_but_not_in_legacy": list(
            #         set(dois_updated_new) - set(dois_updated)
            #     ),
            #     "countries_in_legacy_but_not_in_new": list(
            #         set(countries) - set(countries_new)
            #     ),
            #     "countries_in_new_but_not_in_legacy": list(
            #         set(countries_new) - set(countries)
            #     ),
            # }

        dois_created_new = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_dois_from_response,
            action="_created_at",
        )

        dois_updated_new = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_dois_from_response,
            action="_updated_at",
        )

        countries_new = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_countries_from_response,
            action="_created_at",
        )

        countries_new_updated = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_countries_from_response,
            action="_updated_at",
        )

        mapped_dois_and_files_new = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_mapped_dois_and_files_new,
            action="_created_at",
        )

        mapped_dois_and_files_new_updated = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_mapped_dois_and_files_new,
            action="_updated_at",
        )

        mapped_dois_and_publishers_created = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_publishers_from_response,
            action="_created_at",
        )

        mapped_dois_and_publishers_updated = es_new.get_items(
            batch_size=options["batch_size"],
            gte=options["gte"],
            time_unit=options["time_unit"],
            parse_function=get_publishers_from_response,
            action="_updated_at",
        )

        data = {
            "created": {
                "dois": dois_created_new,
                "countries": countries_new,
                "files_by_doi": mapped_dois_and_files_new,
                "publishers": mapped_dois_and_publishers_created,
            },
            "updated": {
                "dois": dois_updated_new,
                "countries": countries_new_updated,
                "files_by_doi": mapped_dois_and_files_new_updated,
                "publishers": mapped_dois_and_publishers_updated,
            },
        }

        if options["legacy"]:
            data_legacy = {
                "created": {
                    "dois": dois_created,
                    "countries": countries,
                    "files_by_doi": mapped_dois_and_files_legacy,
                    "publishers": mapped_dois_and_publishers_created_legacy,
                },
                "updated": {
                    "dois": dois_updated,
                    "countries": countries_updated,
                    "files_by_doi": mapped_dois_and_added_files_on_update,
                    "publishers": mapped_dois_and_publishers_updated_legacy,
                },
            }

        file_path = f"harvest_summary_{get_timestamp_str()}.json"
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
        file_path = f"harvest_summary_{get_timestamp_str()}_legacy.json"
        with open(file_path, "w") as file:
            json.dump(data_legacy, file, indent=4)
