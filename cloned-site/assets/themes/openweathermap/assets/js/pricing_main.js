fetch("https://home.openweathermap.org/pricing")
    .then(response => response.json())
    .then(data => {

        let currency;
        if (data.currency) {
            currency = data.currency;
        } else {
            currency = 'GBP';
        }

        let currencyFormat;

        if (currency == 'EUR') {
            currencyFormat = Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: currency,
                maximumSignificantDigits: 2,
            });
        } else {
            currencyFormat = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
                maximumSignificantDigits: 2,
            });
        }

        var currencies = document.getElementsByClassName("currency");
        for (var i = 0; i < currencies.length; i++) {
            currencies.item(i).innerHTML = currencyFormat.format(currencies.item(i).innerHTML);
        }
    })
    .catch(err => {
        currency = 'GBP';
        let currencyFormat;

        if (currency == 'EUR') {
            currencyFormat = Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: currency,
                maximumSignificantDigits: 2,
            });
        } else {
            currencyFormat = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
                maximumSignificantDigits: 2,
            });
        }

        var currencies = document.getElementsByClassName("currency");
        for (var i = 0; i < currencies.length; i++) {
            currencies.item(i).innerHTML = currencyFormat.format(currencies.item(i).innerHTML);
        }

        console.log(err);
    })