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
      getCurrentValue(20)
        .then(({ avg: avgValue, current: currentValue }) => {

          if (typeof inflectionValue == 'undefined') { //First iteration
            inflectionValue = avgValue;
          } else if (trending == TrendingType.Increasing) {

            if (avgValue < inflectionValue) {
              trending = TrendingType.Decreasing;
              numIntervalsKeeping = 0;
            } else if (inflectionValue + delta <= avgValue) {
              numIntervalsKeeping++;
            } else {
              numIntervalsKeeping = 0;
            }

          } else if (trending == TrendingType.Decreasing) {

            if (avgValue >= inflectionValue) {
              trending = TrendingType.Increasing;
              numIntervalsKeeping = 0;
            } else if (inflectionValue - delta > avgValue) {
              numIntervalsKeeping++;
            } else {
              numIntervalsKeeping = 0;
            }
          }

          if (numIntervalsKeeping == numIntervalsFilter) {
            sendMessage(notify(currentValue, trending));
            inflectionValue = avgValue;
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
