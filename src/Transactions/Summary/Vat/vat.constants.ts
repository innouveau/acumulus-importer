// Rubriek 5c van de btw-aangifte: "Subtotaal" = te betalen (positief) of terug te vragen (negatief)
export const VAT_TO_PAY_SECTION = 'r5c'
export const HOME_COUNTRY = 'NL'

// Contacten met verkoopfacturen: debiteuren (1) en relaties (3)
export const INVOICE_CONTACT_TYPES = 13

// Acumulus remt bij veel gelijktijdige verzoeken (429): daarom één tegelijk
export const REQUEST_CONCURRENCY = 1

// Afrondingsverschillen van een paar cent zijn normaal (Acumulus rondt per factuurregel af)
export const ROUNDING_TOLERANCE = 0.05
