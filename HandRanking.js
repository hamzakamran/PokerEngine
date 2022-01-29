function sortHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        for (let j = 0; j < hand.length; j++) {
            if (i !== j && hand[i].value < hand[j].value) {
                let temp = hand[i];
                hand[i] = hand[j];
                hand[j] = temp;
            }
        }
    }
}

function getGroups(hand) {
    let groups = {};
    for (let card of hand) {
        if (groups[card.rank] === undefined) {
            groups[card.rank] = [card];
        } else {
            groups[card.rank].push(card);
        }
    }
    return groups;
}

function isFlush(hand) {
    for (let i = 1; i < hand.length; i++) {
        if (hand[i].suit !== hand[0].suit) {
            return false;
        }
    }
    return true;
}

function isStraight(hand) {
    if (hand[0].value === 2 &&
        hand[1].value === 3 &&
        hand[2].value === 4 &&
        hand[3].value === 5 &&
        hand[4].value === 14) {
        hand[4].value = 1;
        sortHand(hand);
    }
    for (let i = 0; i < hand.length - 1; i++) {
        if (hand[i + 1].value !== hand[i].value + 1) {
            return false;
        }
    }
    return true;
}

function kGroup(n, groups) {
    let res = [];
    for (const [cardValue, group] of Object.entries(groups)) {
        if (group.length === n) {
            res.push(group);
        }
    }
    return res;
}

function determineWinningHand(communityCards, players) {
    let bestHands = [];
    for (let player of players) {
        bestHands.push(determineBestHand(player, communityCards));
    }

    let winners = [bestHands[0]];
    for (let i = 1; i < bestHands.length; i++) {
        if (bestHands[i].ranking > winners[0].ranking) {
            winners = [bestHands[i]];
            console.log("better hand rank");
        } else if (bestHands[i].ranking === winners[0].ranking && bestHands[i].score > winners[0].score) {
            winners = [bestHands[i]];
            console.log("same hand rank, better score");
        } else if (bestHands[i].ranking === winners[0].ranking && bestHands[i].score === winners[0].score) {
            winners.push(bestHands[i]);
            console.log("same score");
        }
    }

    return winners;
}

/*
returns object in form:
{hand, details}
*/
function determineBestHand(holeCards, communityCards) {
    let hands = [];

    let oneCardCombos = [
        [1, 2, 3, 4],
        [1, 2, 3, 5],
        [1, 2, 4, 5],
        [1, 3, 4, 5],
        [2, 3, 4, 5]
    ];
    let twoCardCombos = [
        [1, 2, 3],
        [1, 2, 4],
        [1, 2, 5],
        [1, 3, 4],
        [1, 3, 5],
        [1, 4, 5],
        [2, 3, 4],
        [2, 3, 5],
        [2, 4, 5],
        [3, 4, 5]
    ];

    hands.push(communityCards);

    for (let combo of oneCardCombos) {
        let hand = [holeCards[0]];
        for (let pos of combo) {
            hand.push(communityCards[pos - 1]);
        }
        hands.push(hand);
    }
    for (let combo of oneCardCombos) {
        let hand = [holeCards[1]];
        for (let pos of combo) {
            hand.push(communityCards[pos - 1]);
        }
        hands.push(hand);
    }
    for (let combo of twoCardCombos) {
        let hand = [holeCards[0], holeCards[1]];
        for (let pos of combo) {
            hand.push(communityCards[pos - 1]);
        }
        hands.push(hand);
    }

    let bestHand = hands[0];
    let currentBest = determineHand(bestHand);
    for (let i = 1; i < hands.length; i++) {
        let res = determineHand(hands[i]);
        if (res.ranking >= currentBest.ranking && res.score > currentBest.score) {
            bestHand = hands[i];
            currentBest = res;
        } else if (res.ranking > currentBest.ranking) {
            bestHand = hands[i];
            currentBest = res;
        }
    }

    return {
        hand: bestHand,
        rank: currentBest.rank,
        ranking: currentBest.ranking,
        score: currentBest.score
    };
}

/*
returns object in form:
{rank, ranking, score}
where higher ranking is stronger and higher score is stronger
*/
function determineHand(hand) {
    if (hand.length !== 5) { return -1; }

    sortHand(hand);

    let x = 0;
    let groups = getGroups(hand);
    let quads = kGroup(4, groups);
    let trips = kGroup(3, groups);
    let pairs = kGroup(2, groups);
    let kickers = kGroup(1, groups);

    if (isStraight(hand) && isFlush(hand) &&
        hand[4].value === 14 && hand[4].value - hand[0].value === 4) {
        return {
            rank: "Royal Flush",
            ranking: 10,
            score: 1
        };
    } else if (isStraight(hand) && isFlush(hand)) {
        x = hand[4].value;
        return {
            rank: "Straight Flush",
            ranking: 9,
            score: x
        };
    } else if (quads.length === 1) {
        x = quads[0][0].value * 14 + kickers[0][0].value;
        return {
            rank: "Four of a Kind",
            ranking: 8,
            score: x
        };
    } else if (trips.length === 1 && pairs.length === 1) {
        x = trips[0][0].value * 14 + pairs[0][0].value;
        return {
            rank: "Full House",
            ranking: 7,
            score: x
        };
    } else if (isFlush(hand)) {
        x = kickers[0][0].value +
            14 * kickers[1][0].value +
            (2 * 14) * kickers[2][0].value +
            (3 * 14) * kickers[3][0].value +
            (4 * 14) * kickers[4][0].value;
        return {
            rank: "Flush",
            ranking: 6,
            score: x
        };
    } else if (isStraight(hand)) {
        x = hand[4].value;
        return {
            rank: "Straight",
            ranking: 5,
            score: x
        };
    } else if (trips.length === 1) {
        return {
            rank: "Three of a Kind",
            ranking: 4,
            score: 0
        };
    } else if (pairs.length === 2) {
        x = kickers[0][0].value +
            14 * pairs[0][0].value +
            (2 * 14) * pairs[1][0].value;
        return {
            rank: "Two Pair",
            ranking: 3,
            score: x
        };
    } else if (pairs.length === 1) {
        x = kickers[0][0].value +
            14 * kickers[1][0].value +
            (2 * 14) * kickers[2][0].value +
            (3 * 14) * pairs[0][0].value;
        return {
            rank: "One Pair",
            ranking: 2,
            score: x
        };
    } else {
        x = kickers[0][0].value +
            14 * kickers[1][0].value +
            (2 * 14) * kickers[2][0].value +
            (3 * 14) * kickers[3][0].value +
            (4 * 14) * kickers[4][0].value;
        return {
            rank: "High Card",
            ranking: 1,
            score: x
        };
    }
}