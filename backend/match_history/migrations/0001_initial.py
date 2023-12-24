# Generated by Django 4.1.13 on 2023-12-24 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MatchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner_score', models.IntegerField()),
                ('loser_score', models.IntegerField()),
                ('date_of_match', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'match_history',
                'verbose_name_plural': "match_history's",
            },
        ),
    ]
