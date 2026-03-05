mp.events.add("creator:preview:clothing", (type, drawable, texture) => {

    const player = mp.players.local;

    const components = {
        hats: 0,
        tops: 11,
        pants: 4,
        shoes: 6
    };

    const comp = components[type];

    if (comp !== undefined) {
        player.setComponentVariation(comp, drawable, texture, 0);
    }
});