import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Convertir la chaîne en objet Date
    const parts = value.split(/[- :]/);
    const date = new Date(
      parseInt(parts[2], 10), // année
      parseInt(parts[1], 10) - 1, // mois (0-based)
      parseInt(parts[0], 10), // jour
      parseInt(parts[3], 10), // heures
      parseInt(parts[4], 10)  // minutes
    );

    // Utiliser DatePipe d'Angular pour le formatage
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'medium') || '';
  }
}