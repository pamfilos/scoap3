import pytest
from django.test import TestCase

from scoap3.articles.models import Article
from scoap3.utils.tools import update_article_db_model_sequence


@pytest.mark.django_db()
class ArticleModelTest(TestCase):
    def test_save(self):
        update_article_db_model_sequence(1)
        article = Article.objects.create(title="Test Article", abstract="Test Content")
        article.save()
        self.assertEqual(article.id, 1)

        new_article = Article.objects.create(
            id=1000, title="Test Article 2", abstract="Test Content 2"
        )
        new_article.save()
        self.assertEqual(new_article.id, 1000)

        update_article_db_model_sequence(1001)
        new_article = Article.objects.create(
            title="Test Article 2", abstract="Test Content 2"
        )
        new_article.save()
        self.assertEqual(new_article.id, 1001)

    def test_save_and_update(self):
        article = Article.objects.create(title="Test Article", abstract="Test Content")
        article.save()

        new_article = Article.objects.get(id=article.id)
        new_article.title = "Test Article 2"
        new_article.save()
        self.assertEqual(new_article.title, "Test Article 2")
