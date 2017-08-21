function notificationsAlgorithm() {
  const minsCheckInterval = 5;
  const numIntervalsFilter = 3;
  const delta = 0.015;

  const TrendingType = {
    Increasing: 0,
    Decreasing: 1
  };

  function processNotifications(getCurrentValue, sendMessage) {
    let trending = TrendingType.Increasing;
    let inflectionValue;
    let numIntervalsKeeping = 0;

    return setInterval(() => {
      getCurrentValue()
        .then((currentValue) => {
          currentValue = currentValue.price;

          if (typeof inflectionValue == 'undefined') { //First iteration
            inflectionValue = currentValue;
          } else if (trending == TrendingType.Increasing) {

            if (currentValue < inflectionValue) {
              trending = TrendingType.Decreasing;
              inflectionValue = currentValue;
              numIntervalsKeeping = 0;
            } else if (inflectionValue + delta <= currentValue) {
              numIntervalsKeeping++;
            } else {
              numIntervalsKeeping = 0;
            }

          } else if (trending == TrendingType.Decreasing) {

            if (currentValue >= inflectionValue) {
              trending = TrendingType.Increasing;
              inflectionValue = currentValue;
              numIntervalsKeeping = 0;
            } else if (inflectionValue - delta > currentValue) {
              numIntervalsKeeping++;
            } else {
              numIntervalsKeeping = 0;
            }
          }

          if (numIntervalsKeeping == numIntervalsFilter) {
            sendMessage(notify(currentValue, trending));
            inflectionValue = currentValue;
            numIntervalsKeeping = 0;
          }
        });

    }, minsCheckInterval * 60 * 1000);
  }

  const Icons = {
    party: '\u{1F389}',
    down: '\u{1F44E}'
  };

  function notify(currentValue, trending) {
    let message;
    if (trending == TrendingType.Increasing) {
      message = '¡Vamos subiendo! ' + Icons.party;
    } else {
      message = 'Nos hundimos... ' + Icons.down;
    }
    return message + `\nIOTA = ${currentValue}$`
  }

  return {
    processNotifications
  }
}

module.exports = notificationsAlgorithm;
