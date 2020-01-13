tweenX = function (object, from, to, duration, delay) {
    delay = ( !delay ? 0 : delay );
    main.tweens.addCounter({
        from: from,
        to: to,
        delay: delay,
        duration: duration,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween) {
            object.x = tween.getValue();
        }
    });
}

tweenY = function (object, from, to, duration, delay) {
    delay = ( !delay ? 0 : delay );
    main.tweens.addCounter({
        from: from,
        to: to,
        delay: delay,
        duration: duration,
        yoyo: false,
        repeat: 0,
        onUpdate: function (tween) {
            object.y = tween.getValue();
        }
    });
}