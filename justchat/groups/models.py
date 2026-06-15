# Create your models here.
from django.db import models
from django.conf import settings

class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Many-to-many relationship tracked through a custom membership table
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        through='GroupMembership', 
        related_name='chat_groups'
    )

    def __str__(self):
        return self.name


class GroupMembership(models.Model):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('admin', 'Admin'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents a user from being added to the same group twice
        unique_together = ('user', 'group')

    def __str__(self):
        return f"{self.user.username} in {self.group.name} ({self.role})"