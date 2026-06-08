from django.contrib.auth.models import User
from django.db import models


class Fic(models.Model):
    ao3_id = models.CharField(max_length=20, unique=True)
    url = models.URLField()
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list)
    fandoms = models.JSONField(default=list)
    rating = models.CharField(max_length=50, blank=True)
    warnings = models.JSONField(default=list)
    categories = models.JSONField(default=list)
    characters = models.JSONField(default=list)
    relationships = models.JSONField(default=list)
    additional_tags = models.JSONField(default=list)
    summary = models.TextField(blank=True)
    language = models.CharField(max_length=100, blank=True)
    word_count = models.IntegerField(null=True, blank=True)
    total_chapters = models.IntegerField(null=True, blank=True)
    is_complete = models.BooleanField(null=True, blank=True)
    kudos = models.IntegerField(null=True, blank=True)
    hits = models.IntegerField(null=True, blank=True)
    bookmarks = models.IntegerField(null=True, blank=True)
    comments = models.IntegerField(null=True, blank=True)
    date_published = models.DateField(null=True, blank=True)
    date_updated = models.DateField(null=True, blank=True)
    last_scraped = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(User, through='UserFic', related_name='fics')

    def __str__(self):
        return f"{self.title} ({self.ao3_id})"


class UserFic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_fics')
    fic = models.ForeignKey(Fic, on_delete=models.CASCADE, related_name='user_fics')
    date_added = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    reread_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'fic')

    def __str__(self):
        return f"{self.user.username} → {self.fic.ao3_id}"
