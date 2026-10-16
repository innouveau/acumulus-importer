// Bedragen gelden als gelijk binnen een halve cent
export const AMOUNT_TOLERANCE = 0.005

// Gewicht per kenmerk bij het sorteren van suggesties
export const MATCH_WEIGHTS = { number: 4, amount: 2, name: 1 }

// rapport openstaande debiteuren: 1 = vervallen én nog niet vervallen facturen
export const INCLUDE_ALL_DUE = 1

// Acumulus nummert als jaar + volgnummer van 4 cijfers: "2026-422" in de bank = 20260422
export const SEQUENCE_DIGITS = 4
