from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.me_view, name='me'),
    path('rooms/', views.rooms_view, name='rooms'),
    path('rooms/<int:room_id>/', views.room_detail_view, name='room-detail'),
    path('rooms/<int:room_id>/join/', views.join_room_view, name='join-room'),
    path('rooms/<int:room_id>/messages/', views.room_messages_view, name='room-messages'),
    path('<str:room_name>/', views.room, name='room'),
]