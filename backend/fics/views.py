from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Prefetch
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Fic, UserFic
from .scraper import ScraperError, extract_ao3_id, scrape_fic
from .serializers import FicSerializer, RegisterSerializer, UserFicUpdateSerializer


class FicListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_fics_qs = UserFic.objects.filter(user=request.user)
        fics = (
            Fic.objects
            .filter(users=request.user)
            .prefetch_related(Prefetch("user_fics", queryset=user_fics_qs))
        )
        serializer = FicSerializer(fics, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        url = request.data.get("url", "").strip()
        if not url:
            return Response({"error": "url is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ao3_id = extract_ao3_id(url)
        except ScraperError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                fic = Fic.objects.filter(ao3_id=ao3_id).first()
                if fic is None:
                    fic = Fic.objects.create(**scrape_fic(url))
                _, created = UserFic.objects.get_or_create(user=request.user, fic=fic)
        except ScraperError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        serializer = FicSerializer(fic, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class FicDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def _get_user_fic(self, request, ao3_id):
        try:
            return UserFic.objects.select_related("fic").get(user=request.user, fic__ao3_id=ao3_id)
        except UserFic.DoesNotExist:
            return None

    def patch(self, request, ao3_id):
        user_fic = self._get_user_fic(request, ao3_id)
        if not user_fic:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserFicUpdateSerializer(user_fic, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        fic_serializer = FicSerializer(user_fic.fic, context={"request": request})
        return Response(fic_serializer.data)

    def delete(self, request, ao3_id):
        user_fic = self._get_user_fic(request, ao3_id)
        if not user_fic:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user_fic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.get(user=user)
        return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})
