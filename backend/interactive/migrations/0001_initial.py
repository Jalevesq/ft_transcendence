# Generated by Django 4.1.13 on 2023-12-24 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LookingForMatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paddleA', models.IntegerField()),
                ('mailbox_a', models.TextField()),
                ('paddleB', models.IntegerField(default=-1)),
            ],
        ),
        migrations.CreateModel(
            name='MatchInvite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_inviting', models.IntegerField()),
                ('recipient', models.IntegerField()),
                ('time_stamp', models.TimeField(auto_now=True)),
            ],
        ),
    ]
