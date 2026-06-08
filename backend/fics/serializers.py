from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Fic, UserFic


class FicSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()
    reread_count = serializers.SerializerMethodField()
    date_added = serializers.SerializerMethodField()

    class Meta:
        model = Fic
        fields = [
            "ao3_id", "url", "title", "authors", "fandoms", "rating",
            "warnings", "categories", "characters", "relationships",
            "additional_tags", "summary", "language", "word_count",
            "total_chapters", "is_complete", "kudos", "hits", "bookmarks",
            "comments", "date_published", "date_updated", "last_scraped",
            "is_read", "reread_count", "date_added",
        ]

    def _user_fic(self, obj):
        request = self.context.get("request")
        if not request:
            return None
        try:
            return obj.user_fics.get(user=request.user)
        except UserFic.DoesNotExist:
            return None

    def get_is_read(self, obj):
        uf = self._user_fic(obj)
        return uf.is_read if uf else False

    def get_reread_count(self, obj):
        uf = self._user_fic(obj)
        return uf.reread_count if uf else 0

    def get_date_added(self, obj):
        uf = self._user_fic(obj)
        return uf.date_added if uf else None


class UserFicUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFic
        fields = ["is_read", "reread_count"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user
