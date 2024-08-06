const creeperbutton = document.getElementById('creeper');

creeperbutton.addEventListener('click', () => {
    // summonCreeper();
    console.log(gay);
});


function summonCreeper() {
    sendCommandToServer("/summon Creeper ~ ~ ~", res);
    console.log('Creeper has been spawned');
}
