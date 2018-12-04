const terminalCommand = (cmd, terminal) => {
    terminal.echo("Hey");
}

$(document).ready(() => {
    let $body = $('body');
  
    $body.terminal(terminalCommand, {
      greetings:
        `[[b;;]Now Hiring!] v1.0.0 (Ludum Dare Release)\n` +
        'By Joe Cowman\n' +
        'Powered by the Regal Framework https://github.com/regal/regal\n',
      prompt: '> '
    });
  });