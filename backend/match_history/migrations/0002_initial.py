# Generated by Django 4.1.13 on 2023-12-24 16:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('match_history', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchhistory',
            name='loser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchhistory',
            name='winner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='winner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='matchhistory',
            constraint=models.CheckConstraint(check=models.Q(('winner', models.F('loser')), _negated=True), name='Winner and loser are the same user'),
        ),
    ]
