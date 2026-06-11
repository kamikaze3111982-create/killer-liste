const tmi = require('tmi.js');
const { createClient } = require('@supabase/supabase-js');

// Verbindung zur Datenbank
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// OHNE identity: Der Bot liest nur mit, braucht kein Passwort zum "Zuhören"
const client = new tmi.Client({
    channels: [ 'itsakamoru' ]
});

client.connect();

client.on('message', async (channel, tags, message, self) => {
    if(self) return;

    if(message.startsWith('!wish ')) {
        const killerName = message.replace('!wish ', '').trim();
        // Hier speichern wir den Namen des Chatters (tags['display-name'])
        await supabase.from('killer_wünsche').insert([
            { username: tags['display-name'], killer_name: killerName, abgehakt: false }
        ]);
        client.say(channel, `@${tags['display-name']}, dein Wunsch nach "${killerName}" ist notiert!`);
    }
});