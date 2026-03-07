let isHidden = false;

function setPlayerVisible(show: boolean) {
    const player = mp.players.local;
    if (!player || !mp.players.exists(player)) return;

    if (show) {
        player.setAlpha(255);
        player.setVisible(true, false);
        mp.game.entity.setVisible(player.handle, true, false);
        player.setCollision(true, false);
        isHidden = false;
    } else {
        player.setAlpha(0);
        player.setVisible(false, false);
        mp.game.entity.setVisible(player.handle, false, false);
        isHidden = true;
    }
}

mp.events.add("client::mainmenu:scene", (data: any) => {
    const payload = typeof data === "string" ? JSON.parse(data) : data;
    const showPlayer = payload?.showPlayer === true;
    setPlayerVisible(showPlayer);
});

mp.events.add("client::cef:close", () => {
    if (isHidden) setPlayerVisible(true);
});
