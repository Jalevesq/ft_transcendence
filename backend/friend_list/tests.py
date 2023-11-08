from django.test import TestCase
from friend_list.models import FriendList
from user_profile.models import User
from django.urls import reverse

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        testFriend = User.objects.create(
            nickname="BozoCat",
            email="BozoCat@gmail.com",
            avatar="gekwghkrehkre",
            status="OFF",
            admin=False
        )
        testFriend2 = User.objects.create(
            nickname="BozoDog",
            email="BozoDog@gmail.com",
            avatar="gekwghkrehkre",
            status="OFF",
            admin=False
        )
        FriendList.objects.create(
            friend1=testFriend,
            friend2=testFriend2,
            status="ACCEPTED"
        )


    def test_block_list(self):
        '''Normal check for blocked list'''
        self.assertEqual(FriendList.objects.get(friend1__nickname="BozoCat").friend1.nickname, "BozoCat")
        self.assertEqual(FriendList.objects.get(friend2__nickname="BozoDog").friend2.nickname, "BozoDog")
        self.assertEqual(FriendList.objects.get(friend2__nickname="BozoDog").status, "ACCEPTED")


    def test_get_friend(self):
        """
        Test retrieving all friend with the default.
        """
        response = self.client.get(f"{reverse('friendlist')}?nickname=BozoCat")
        self.assertEqual(response.status_code, 200)

        friends = response.json()['friends'][0]
        self.assertEqual(friends['friend1'], "BozoCat")
        self.assertEqual(friends['friend2'], "BozoDog")
        self.assertEqual(friends['status'], "ACCEPTED")

    def test_get_friend_with_status(self):
        """
        Test retrieving a friend with a specific status (ACCEPTED).
        """
        response = self.client.get(f"{reverse('friendlist')}?nickname=BozoCat&status=ACCEPTED")
        self.assertEqual(response.status_code, 200)

        friends = response.json()['friends'][0]
        self.assertEqual(friends['friend1'], "BozoCat")
        self.assertEqual(friends['friend2'], "BozoDog")
        self.assertEqual(friends['status'], "ACCEPTED")

    def test_not_recognized_status(self):
        """
        Test retrieving a friend with an unrecognized status (BOZO).
        """
        response = self.client.get(f"{reverse('friendlist')}?nickname=BozoCat&status=BOZO")
        self.assertEqual(response.status_code, 400)

    def test_get_no_nickname(self):
        """
        Test retrieving a friend without specifying a nickname (bad request).
        """
        response = self.client.get(f"{reverse('friendlist')}")
        self.assertEqual(response.status_code, 400)
