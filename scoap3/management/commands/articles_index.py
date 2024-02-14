from django.core.management.base import BaseCommand, CommandParser

from scoap3.articles.tasks import index_all_articles


class Command(BaseCommand):
    help = "Article indexing commands"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--from-id",
            type=int,
            default=None,
            required=False,
            help="Article id to start the indexing FROM.",
        )

        parser.add_argument(
            "--batch-size",
            type=int,
            default=1000,
            required=False,
            help="Batchsize to migrate per task.",
        )

    def handle(self, *args, **options):
        index_all_articles(options["batch_size"])
