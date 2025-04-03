import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMontant'
})
export class FormatMontantPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }

    // Convertir en nombre si c'est une chaîne
    const num = typeof value === 'string' ? parseFloat(value) : value;

    // Vérifier si c'est un nombre valide
    if (isNaN(num)) {
      return '0.00';
    }

    // Formater le nombre avec séparateurs de milliers et 2 décimales
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}