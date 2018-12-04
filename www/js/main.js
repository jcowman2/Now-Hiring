const Game = NowHiring.Game;

let newGame = true;
let response = Game.postStartCommand();

const handleOut = (terminal) => {
  if (response.output.wasSuccessful) {
    for (const line of response.output.log) {
      terminal.echo(line.data);
    }
  } else {
    terminal.echo("Something went wrong. Please refresh the window.");
  }
}

const doCommand = (cmd, terminal) => {
  const tempResponse = Game.postPlayerCommand(response.instance, cmd);
  if (tempResponse.output.wasSuccessful) {
    response = tempResponse;
    handleOut(terminal);
  } else {
    terminal.echo("Something went wrong. Please try again.")
  }
}

const terminalCommand = (cmd, terminal) => {
  terminal.echo(" ");
  if (newGame) {
    handleOut(terminal);
    newGame = false;
  } else {
    doCommand(cmd, terminal);
  }
}

$(document).ready(() => {
    let $body = $('body');
  
    $body.terminal(terminalCommand, {
      greetings:
        `[[b;;]Now Hiring!] v1.0.0 (Ludum Dare Release -- Unfinished)\n` +
        'By Joe Cowman\n' +
        'Powered by the Regal Framework https://github.com/regal/regal\n\n' +
        "This game is unfinished. If you're interested in playing the full version, keep an eye on the GitHub repository! \nhttps://github.com/jcowman2/Now-Hiring\n\n" +
        'Press ENTER to begin...',
      prompt: '> '
    });
  });