import Table from "./@core/table";

const main = new Table(1000);

main.addMember('koh');
main.addPlayer('koh');

main.addMember('koh1');
main.addPlayer('koh1');

main.playerAction('koh', 'call');
// main.playerAction('koh1', 'call');
//
// main.playerAction('koh', 'call');
// main.playerAction('koh1', 'call');
//
// main.playerAction('koh', 'call');
// main.playerAction('koh1', 'call');

// main.initNewRound();