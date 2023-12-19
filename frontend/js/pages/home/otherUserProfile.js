
import { fetchUser } from '../../api/fetchData.js';
import { otherMatchHistoryComponent } from '../../components/otherMatchHistory/otherMatchHistory.js';
import { fetchFriendChange } from '../../api/fetchData.js';

// TO DO: ERROR HANDLING
export async function displayOtherUserProfile(event) {
    const button = event.currentTarget
    const iconElement = button.querySelector('i');
    const userID = iconElement ? iconElement.id : NULL;

    const modalElement = document.getElementById('otherUserInfo')
    const otherUserModal = bootstrap.Modal.getInstance(modalElement);
    if (!otherUserModal) {
        console.log("no modal")
        return
    }

    const response = await fetchUser('GET', { id: userID })
    if (!response) { return }
    if (response.status != 200) // User not found
        return

    const userInfo = await response.json()
    const currentUserInfo = userInfo.users[0]
    updateOtherModal(currentUserInfo)
    displayInfo(currentUserInfo)

    otherUserModal.show()
}

function updateOtherModal(currentUserInfo) {
    updateWinrateAndClass(currentUserInfo)
    updateFriendButton(currentUserInfo)
}

function displayInfo(currentUserInfo) {
    displayBasicInfo(currentUserInfo)
    displayOtherMatchHistory(currentUserInfo)
}

// TO DO: ERROR HANDLING FOR RESPONSE
async function updateFriendButton(currentUserInfo) {
    const response = await fetchFriendChange('GET', { id: currentUserInfo.id });
    if (!response || response.status !== 200) return;

    const friendState = await response.json();
    const addFriendBtn = document.getElementById('addFriendBtn');
    const deleteFriendBtn = document.getElementById('deleteFriendBtn');

    function updateButtons(addText, addAction, deleteText, deleteAction, showAdd, showDelete) {
        addFriendBtn.textContent = addText;
        addFriendBtn.dataset.action = addAction;
        addFriendBtn.classList.toggle('d-none', !showAdd);
        deleteFriendBtn.textContent = deleteText;
        deleteFriendBtn.dataset.action = deleteAction;
        deleteFriendBtn.classList.toggle('d-none', !showDelete);
    }

    switch (friendState.state) {
        case 'none':
            updateButtons('Add Friend', 'add', '', '', true, false);
            break;
        case 'friend':
            updateButtons('', '', 'Unfriend', 'unfriend', false, true);
            break;
        case 'receivedRequest':
            updateButtons('Accept', 'accept', 'Refuse', 'refuse', true, true);
            break;
        case 'sentRequest':
            updateButtons('', '', 'Cancel Request', 'cancel', false, true);
            break;
    }
}

function updateWinrateAndClass(currentUserInfo) {
    const modalDialog = document.getElementById('otherUserInfoDialog')
    const modalContent = modalDialog.querySelector('.modal-content')
    const ratio = document.getElementById('winrate')
    if (currentUserInfo.played_matches.length > 0) {
        modalDialog.classList.add('modal-lg')
        ratio.classList.remove('d-none')
        document.getElementById('otherMatchHistory').classList.remove('d-none')
    } else {
        modalDialog.classList.remove('modal-lg')
        ratio.classList.add('d-none')
        document.getElementById('otherMatchHistory').classList.add('d-none')
    }
    modalContent.id = currentUserInfo.id
}

function displayBasicInfo(currentUserInfo) {

    const nickname = document.getElementById('userNickname')
    nickname.textContent = currentUserInfo.nickname

    const avatar = document.getElementById('userAvatar')
    avatar.src = currentUserInfo.avatar

    const winCount = document.getElementById('userWins')
    winCount.textContent = currentUserInfo.won_matches.length;

    const lossesCount = document.getElementById('userLosses')
    lossesCount.textContent = currentUserInfo.lost_matches.length;

    const matchesPlayed = document.getElementById('userMatchesPlayed')
    matchesPlayed.textContent = currentUserInfo.played_matches.length;

    const ratio = document.getElementById('userWinrate')
    if (winCount.textContent == 0) {
        ratio.textContent = 0 + "%"
    } else {
        const winCountNumber = parseInt(winCount.textContent, 10);
        const matchesPlayedNumber = parseInt(matchesPlayed.textContent, 10);

        const winRatio = (winCountNumber / matchesPlayedNumber) * 100;
        ratio.textContent = winRatio.toFixed(2) + "%";
    }
}

async function displayOtherMatchHistory(currentUserInfo) {
    const matchHistoryContainer = document.getElementById('matchHistoryContainer');
    matchHistoryContainer.innerHTML = '';
    const otherMatchHistoryTemplate = await otherMatchHistoryComponent()

    currentUserInfo.played_matches.forEach(match => {
        const matchEntry = otherMatchHistoryTemplate.cloneNode(true);

        matchEntry.querySelector('#otherDateOfMatch').textContent = match.date_of_match;
        matchEntry.querySelector('#otherWinnerUsername').textContent = match.winner_username;
        matchEntry.querySelector('#otherWinnerScore').textContent = match.winner_score;
        matchEntry.querySelector('#otherLoserUsername').textContent = match.loser_username;
        matchEntry.querySelector('#otherLoserScore').textContent = match.loser_score;

        matchEntry.querySelector('#otherDateOfMatch').id = '';
        matchEntry.querySelector('#otherWinnerUsername').id = '';
        matchEntry.querySelector('#otherWinnerScore').id = '';
        matchEntry.querySelector('#otherLoserUsername').id = '';
        matchEntry.querySelector('#otherLoserScore').id = '';

        matchHistoryContainer.appendChild(matchEntry);
    });
}
