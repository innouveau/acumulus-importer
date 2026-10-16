# Acumulus importer

Lokale Vue-app om de kwartaal-export van de bank in te delen en via de Acumulus API te boeken. Geen login: draai hem alleen lokaal.

## Starten

```bash
cp .env.example .env.local   # contractcode, gebruikersnaam, wachtwoord invullen
npm install
npm run dev                  # http://127.0.0.1:5199
```

Maak in Acumulus bij voorkeur een aparte gebruiker van het type "API-gebruiker".

## Hoe het werkt

- De dev-server bevat een kleine backend (`server/api.ts`): die voegt de inloggegevens uit `.env.local` toe en stuurt verzoeken door naar Acumulus. Je wachtwoord komt dus nooit in de browser.
- Regels, instellingen en wat al geboekt is staan als JSON in `data/` (`rules.json`, `settings.json`, `booked.json`).
- Testmodus staat standaard aan: Acumulus controleert dan alles, maar boekt niets.

| Soort | Acumulus-API |
|---|---|
| Kosten (zakelijk) | `expenses/expense_add.php`, betaald via de gekozen rekening |
| Privé-boeking | `transfers/private_transfer_add.php` |
| Handmatig (o.a. BTW-afdracht, inkomsten) | geen API: in Acumulus zelf doen, daarna "markeer als gedaan" |
