import { Category } from './category.enum'

export const CATEGORY_LABELS: Record<Category, string> = {
    [Category.Normal]: 'Transacties',
    [Category.Private]: 'Privé-boekingen',
    [Category.Sales]: 'Uitgaande facturen (betaald)',
    [Category.Vat]: 'Btw',
    [Category.Purchase]: 'Inkomende facturen',
}
