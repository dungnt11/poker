import * as uuid from 'uuid';
import poker from './poker';

/**
 * Round name: Pre-Flop - Flop - Turn - River - Showdown
 * Pre-Flop - Dealer chia 2 lá bài cho mọi người
 * Flop - Dealer đặt 3 lá bài giữa bàn
 * Turn - Dealer đặt 4 lá bài
 * River - Trên bàn có 5 lá bài
 * Showdown - Mọi người mở lá bài của mình và kiểm tra ai là người thắng cuộc
 */
class TablePoker {
    idTable = uuid.v4();
    members = new Map();

    // Config
    smallBlind = 10;
    bigBlind = 20;
    minPlayers = 2;
    maxPlayers = 5;

    buyInTable = 1000;
    maxTimePerTurn = 15_000; // 15s

    constructor(buyInTable) {
        this.buyInTable = buyInTable;
        this.table = new poker.Table(
            this.smallBlind,
            this.bigBlind,
            this.minPlayers,
            this.maxPlayers,
        );
        this.handleEvent();
    }

    // Quan ly table theo ID
    getIDTable() {
        return this.idTable;
    }

    hasMemberByUsername(usernameMember) {
        return this.members.has(usernameMember);
    }

    addMember(usernameMember, ws) {
        if (this.hasMemberByUsername(usernameMember)) {
            throw new Error("Member already exists");
        }
        this.members.set(usernameMember, ws);
    }

    addPlayer(username) {
        if (!this.hasMemberByUsername(username)) {
            throw new Error("Please add user to member before");
        }

        if (this.table.players.length > this.maxPlayers) {
            throw new Error("Table is max players");
        }
        this.table.AddPlayer(username, this.buyInTable);
    }

    playerAction(usernamePlayer, action, bet) {
        // Check(), Fold(), Bet(bet), Call(), AllIn()
        if (['check', 'fold', 'bet', 'call', 'allIn'].includes(action) === false) {
            throw new Error("Player action was not provided");
        }

        const playerByUsername = this.table.players.find((e) => e.playerName === usernamePlayer);
        if (!playerByUsername) {
            throw new Error("Player not found");
        }

        switch (action) {
            case 'check':
                playerByUsername.Check();
                break;

            case 'fold':
                playerByUsername.Fold();
                break;

            case 'bet':
                playerByUsername.Bet(bet);
                break;

            case 'call':
                playerByUsername.Call();
                break;

            case 'allIn':
                playerByUsername.AllIn();
                break;

            default:
                playerByUsername.Fold();
                break;
        }
    }

    handleEvent() {
        const eventGame = this.table.getEventEmitter();
        eventGame.on('newRound', () => {
            console.log("newRound")
        })
        eventGame.on('turn', () => {
            const turnBet = this.table.getPreviousPlayerAction();
            const currentPlayer = this.table.getCurrentPlayer();
            console.log('turn', currentPlayer, turnBet)
        })
        eventGame.on('gameOver', () => {
            console.log('gameOver')
        })
        eventGame.on('deal', () => {
            console.log('deal')
        })
    }

    initNewRound() {
        this.table.initNewRound();
    }
}

export default TablePoker;